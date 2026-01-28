'use client'

import type { Event } from '@/types'
import { OpenCardProvider } from '@/app/[locale]/(platform)/(home)/_components/EventOpenCardProvider'
import FeaturedMarket from '@/app/[locale]/(platform)/(home)/_components/FeaturedMarket'
import MarketSection from '@/app/[locale]/(platform)/(home)/_components/MarketSection'

interface HomeClientProps {
  featuredEvents: Event[]
  basketballEvents: Event[]
  hockeyEvents: Event[]
  trendingEvents: Event[]
}

export default function HomeClient({
  featuredEvents,
  basketballEvents,
  hockeyEvents,
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
          title="Pro basketball"
          tag="basketball"
          events={basketballEvents}
        />

        <MarketSection
          title="Pro hockey"
          tag="hockey"
          events={hockeyEvents}
        />

        {/* Fallback or additional section if others are empty */}
        {basketballEvents.length === 0 && hockeyEvents.length === 0 && (
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
