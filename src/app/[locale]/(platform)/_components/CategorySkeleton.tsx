import { Skeleton } from '@/components/ui/skeleton'

export default function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array.from({ length: 8 })].map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-5 w-full" />
          <div className="mt-2 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          <Skeleton className="mt-2 h-1 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}
