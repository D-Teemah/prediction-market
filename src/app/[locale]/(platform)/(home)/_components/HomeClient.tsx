'use client'

import type { Event } from '@/types'
import { OpenCardProvider } from '@/app/[locale]/(platform)/(home)/_components/EventOpenCardProvider'
import FeaturedMarket from '@/app/[locale]/(platform)/(home)/_components/FeaturedMarket'
import MarketSection from '@/app/[locale]/(platform)/(home)/_components/MarketSection'

interface HomeClientProps {
  featuredEvents: Event[]
  politicsEvents: Event[]
  entertainmentEvents: Event[]
  trendingEvents: Event[]
}

export default function HomeClient({
  featuredEvents,
  politicsEvents,
  entertainmentEvents,
  trendingEvents,
}: HomeClientProps) {
  // Note: We are temporarily removing FilterToolbar and EventsGrid to match the requested layout.
  // The user wants a specific structure.

  return (
    <OpenCardProvider>
      <div className="space-y-8 pb-12">
        {featuredEvents.length > 0 && (
          <FeaturedMarket events={featuredEvents} />
        )}

        <MarketSection
          title="Nigerian Politics"
          tag="politics"
          events={politicsEvents}
        />

        <MarketSection
          title="Entertainment & Culture"
          tag="entertainment"
          events={entertainmentEvents}
        />

        {/* Fallback or additional section if others are empty */}
        {politicsEvents.length === 0 && entertainmentEvents.length === 0 && (
          <MarketSection
            title="Trending"
            tag="trending"
            events={trendingEvents}
          />
        )}
      </div>
    </OpenCardProvider>
  )
}
