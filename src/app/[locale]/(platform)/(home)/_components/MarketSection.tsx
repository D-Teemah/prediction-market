'use client'

import type { Event } from '@/types'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import CompactEventCard from './CompactEventCard'

interface MarketSectionProps {
  title: string
  tag: string
  events: Event[]
}

export default function MarketSection({ title, tag, events }: MarketSectionProps) {
  if (!events || events.length === 0) {
    return null
  }

  return (
    <section className="py-6">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <span className="text-sm text-muted-foreground">
          (
          {events.length}
          {' '}
          total)
        </span>
        <Link href={`/?tag=${tag}`} className="text-muted-foreground hover:text-foreground">
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map(event => (
          <CompactEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  )
}
