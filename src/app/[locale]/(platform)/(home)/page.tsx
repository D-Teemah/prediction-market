'use cache'

import HomeClient from '@/app/[locale]/(platform)/(home)/_components/HomeClient'
import { EventRepository } from '@/lib/db/queries/event'

export default async function HomePage() {
  const [trendingRes, politicsRes, entertainmentRes] = await Promise.all([
    EventRepository.listEvents({ tag: 'trending' }),
    EventRepository.listEvents({ tag: 'politics' }),
    EventRepository.listEvents({ tag: 'entertainment' }),
  ])

  const trendingEvents = trendingRes.data ?? []
  const politicsEvents = politicsRes.data ?? []
  const entertainmentEvents = entertainmentRes.data ?? []

  // Use top 5 trending events for the slider
  const featuredEvents = trendingEvents.slice(0, 5)

  return (
    <main className="container py-4">
      <HomeClient
        featuredEvents={featuredEvents}
        politicsEvents={politicsEvents}
        entertainmentEvents={entertainmentEvents}
        trendingEvents={trendingEvents}
      />
    </main>
  )
}
