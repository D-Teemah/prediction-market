import CategorySkeleton from '@/app/[locale]/(platform)/_components/CategorySkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="container py-4">
      <Skeleton className="mb-6 h-8 w-48" />
      <CategorySkeleton />
    </main>
  )
}
