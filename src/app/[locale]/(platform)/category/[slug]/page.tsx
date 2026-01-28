import { Suspense } from 'react'
import CompactEventCard from '@/app/[locale]/(platform)/(home)/_components/CompactEventCard'
import { OpenCardProvider } from '@/app/[locale]/(platform)/(home)/_components/EventOpenCardProvider'
import CategorySkeleton from '@/app/[locale]/(platform)/_components/CategorySkeleton'
import { EventRepository } from '@/lib/db/queries/event'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <main className="container py-4">
      <h1 className="mb-6 text-2xl font-bold capitalize">{slug.replace(/-/g, ' ')}</h1>
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryEventsList slug={slug} />
      </Suspense>
    </main>
  )
}

async function CategoryEventsList({ slug }: { slug: string }) {
  const { data: events } = await EventRepository.listEvents({ tag: slug })

  return (
    <OpenCardProvider>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events?.map(event => (
          <CompactEventCard key={event.id} event={event} />
        ))}
        {(!events || events.length === 0) && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No events found for this category.
          </div>
        )}
      </div>
    </OpenCardProvider>
  )
}
