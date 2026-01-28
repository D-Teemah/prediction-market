'use client'

import type { Event, Market, Outcome } from '@/types'
import { format } from 'date-fns'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { formatCompactShares } from '@/lib/formatters'

interface CompactEventCardProps {
  event: Event
}

export default function CompactEventCard({ event }: CompactEventCardProps) {
  const primaryMarket = event.markets[0]
  if (!primaryMarket) {
    return null
  }

  // Helper to format date like "Jan 29 @ 1:00 AM"
  const formattedDate = event.end_date
    ? format(new Date(event.end_date), 'MMM d @ h:mm a')
    : 'No date'

  // Volume
  const volume = formatCompactShares(event.volume)

  // Sort outcomes by probability (descending) or index
  // For sports (Team A vs Team B), usually we show both.
  const outcomes = primaryMarket.outcomes
    .slice(0, 2) // Show top 2 for compact view? Or all? Image shows 2 for basketball.

  return (
    <Link
      href={`/event/${event.slug}`}
      className="group block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/50"
    >
      {/* Header: Date | Volume */}
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{formattedDate}</span>
        <span>{volume}</span>
      </div>

      {/* Title */}
      <h3 className="mb-4 line-clamp-2 text-sm leading-tight font-bold text-foreground">
        {event.title}
      </h3>

      {/* Outcomes List */}
      <div className="space-y-2">
        {outcomes.map(outcome => (
          <OutcomeRow
            key={outcome.token_id}
            outcome={outcome}
            market={primaryMarket}
          />
        ))}
      </div>

      {/* Bottom Color Bar (Distribution) */}
      <div className="mt-3 flex h-1 w-full overflow-hidden rounded-full">
        {outcomes.map((outcome, index) => {
          // Calculate width based on probability
          // If we don't have probability on outcome, we might need to find it from market.probability or price
          // Market object has `outcomes` but `price` is on Market level?
          // Wait, `Market` has `price` and `probability` but those are for the market as a whole?
          // No, `outcomes` usually don't have probability directly in the type definition I saw earlier?
          // Let's check `types/index.ts` again. `Outcome` has `buy_price`?
          // In `EventCardMarketsList`, it calculates chance: `getDisplayChance(market.condition_id)`.
          // But that's for Binary markets where Yes/No are the outcomes.
          // For Categorical markets (like "Winner"), each outcome has a price.
          // `Outcome` type has `buy_price`, `sell_price`.

          // Use brand colors: Primary (Green), Destructive (Red), Foreground (Black)
          const chance = (outcome.buy_price ?? 0) * 100
          const colorClass = index === 0 ? 'bg-primary' : (index === 1 ? 'bg-destructive' : 'bg-[#0F172A]')

          return (
            <div
              key={outcome.token_id}
              className={colorClass}
              style={{ width: `${chance}%` }}
            />
          )
        })}
        {/* If chances don't add up to 100, we might need a gray background or normalization */}
      </div>
    </Link>
  )
}

function OutcomeRow({ outcome, market }: { outcome: Outcome, market: Market }) {
  // Try to find icon from market or outcome metadata?
  // The type definition showed `market.icon_url`.
  // For sports, maybe the outcome text is the team name.
  // I'll just use a placeholder icon if no URL.

  const chance = Math.round((outcome.buy_price ?? 0) * 100)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Logo/Icon */}
        <div className="flex size-5 items-center justify-center overflow-hidden rounded-full bg-muted text-[10px]">
          {/* Use market icon or first letter */}
          {market.icon_url
            ? (
                <Image src={market.icon_url} alt={outcome.outcome_text} width={20} height={20} />
              )
            : (
                outcome.outcome_text.substring(0, 2).toUpperCase()
              )}
        </div>
        <span className="text-sm font-medium text-foreground">
          {outcome.outcome_text}
        </span>
      </div>

      <span className="text-sm font-semibold text-foreground">
        {chance}
        %
      </span>
    </div>
  )
}
