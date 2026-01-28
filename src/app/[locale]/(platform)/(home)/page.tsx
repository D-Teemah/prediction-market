'use cache'

import HomeClient from '@/app/[locale]/(platform)/(home)/_components/HomeClient'
import { EventRepository } from '@/lib/db/queries/event'

export default async function HomePage() {
  const [trendingRes, basketballRes, hockeyRes] = await Promise.all([
    EventRepository.listEvents({ tag: 'trending' }),
    EventRepository.listEvents({ tag: 'basketball' }),
    EventRepository.listEvents({ tag: 'hockey' }),
  ])

  const trendingEvents = trendingRes.data ?? []
  const basketballEvents = basketballRes.data ?? []
  const hockeyEvents = hockeyRes.data ?? []

  // Use top 5 trending events for the slider
  const featuredEvents = trendingEvents.slice(0, 5)

  return (
    <main className="container py-4">
      <HomeClient
        featuredEvents={featuredEvents}
        basketballEvents={basketballEvents}
        hockeyEvents={hockeyEvents}
        trendingEvents={trendingEvents}
      />
    </main>
  )
}
