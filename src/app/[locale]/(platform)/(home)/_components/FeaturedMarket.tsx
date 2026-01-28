'use client'

import type { Event } from '@/types'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, ExternalLink, TrendingUp } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import FeaturedEventChart from './FeaturedEventChart'

interface FeaturedMarketProps {
  events: Event[]
}

export default function FeaturedMarket({ events }: FeaturedMarketProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnMouseEnter: true, stopOnInteraction: false }),
  ])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  if (!events || events.length === 0) {
    return null
  }

  return (
    <div className="group relative mb-8 overflow-hidden rounded-xl border border-white/10 bg-black text-white shadow-lg">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {events.map(event => (
            <div className="min-w-0 flex-[0_0_100%]" key={event.slug}>
              <FeaturedEventContent event={event} />
            </div>
          ))}
        </div>
      </div>

      {events.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={`
              absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/20 text-white opacity-0 shadow-sm
              backdrop-blur-sm transition-opacity
              group-hover:opacity-100
              hover:bg-white/30
            `}
            onClick={scrollPrev}
          >
            <ChevronLeft className="size-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`
              absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/20 text-white opacity-0 shadow-sm
              backdrop-blur-sm transition-opacity
              group-hover:opacity-100
              hover:bg-white/30
            `}
            onClick={scrollNext}
          >
            <ChevronRight className="size-6" />
          </Button>
        </>
      )}
    </div>
  )
}

function FeaturedEventContent({ event }: { event: Event }) {
  const primaryMarket = event.markets[0]
  if (!primaryMarket) {
    return null
  }

  const topOutcomes = [...primaryMarket.outcomes]
    .sort((a, b) => (b.buy_price ?? 0) - (a.buy_price ?? 0))
    .slice(0, 3)

  return (
    <div className="p-8">
      <div className="grid items-center gap-8 lg:grid-cols-3">
        {/* Left Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className={`
              inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wider
              text-white uppercase backdrop-blur-md
            `}
            >
              <TrendingUp className="size-3" />
              Featured
            </span>
            <span className="text-xs font-medium tracking-wider text-white/80 uppercase">
              {event.main_tag || 'Market'}
            </span>
          </div>

          <div className="flex items-start gap-4">
            {event.icon_url && (
              <div className={`
                relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-inner
                sm:size-20
              `}
              >
                {/* eslint-disable-next-line next/no-img-element */}
                <img
                  src={event.icon_url}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <h1 className="text-2xl leading-tight font-black text-white sm:text-4xl">
              {event.title}
            </h1>
          </div>

          {primaryMarket.resolution_source && (
            <div className="flex items-center gap-1.5 text-xs text-white/70">
              <span className="font-medium text-white/90">Source:</span>
              {primaryMarket.resolution_source_url
                ? (
                    <a
                      href={primaryMarket.resolution_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        flex items-center gap-1 decoration-white/50 underline-offset-2 transition-colors
                        hover:text-white hover:underline
                      `}
                      onClick={e => e.stopPropagation()}
                    >
                      {primaryMarket.resolution_source}
                      <ExternalLink className="size-3" />
                    </a>
                  )
                : (
                    <span>{primaryMarket.resolution_source}</span>
                  )}
            </div>
          )}

          {/* Chart Placeholder / Visual */}
          <FeaturedEventChart event={event} />
        </div>

        {/* Right Actions */}
        <div className={`
          flex flex-col gap-4 rounded-2xl border border-white/10 bg-primary p-6 shadow-xl backdrop-blur-sm
        `}
        >
          <h3 className="mb-2 text-lg font-bold text-primary-foreground">Outcome Probability</h3>
          {topOutcomes.map((outcome, idx) => {
            const chance = Math.round((outcome.buy_price ?? 0) * 100)

            let barColor = ''
            let textColor = ''
            let priceBadgeColor = ''

            if (idx === 0) {
              barColor = 'bg-white hover:bg-white/90'
              textColor = 'text-[#4CAF50]' // Use brand green for text on white
              priceBadgeColor = 'bg-[#4CAF50]/10'
            }
            else if (idx === 1) {
              barColor = 'bg-[#E53935] hover:bg-[#E53935]/90' // Brand red
              textColor = 'text-white'
              priceBadgeColor = 'bg-white/20'
            }
            else {
              barColor = 'bg-[#0F172A] hover:bg-[#0F172A]/90' // Brand black/slate
              textColor = 'text-white'
              priceBadgeColor = 'bg-white/20'
            }

            return (
              <div key={outcome.token_id} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium text-white">
                  <span>{outcome.outcome_text}</span>
                  <span>
                    {chance}
                    %
                  </span>
                </div>

                <Button
                  className={cn(
                    'h-12 w-full justify-between shadow-sm transition-all hover:scale-[1.02]',
                    barColor,
                    textColor,
                  )}
                  asChild
                >
                  <Link href={`/event/${event.slug}`}>
                    <span className="font-bold">
                      Buy
                      {outcome.outcome_text}
                    </span>
                    <span className={cn('rounded px-2 py-0.5 font-mono text-sm', priceBadgeColor)}>
                      {chance}
                      ¢
                    </span>
                  </Link>
                </Button>
              </div>
            )
          })}
          <Link
            href={`/event/${event.slug}`}
            className="mt-2 text-center text-xs text-white/70 transition-colors hover:text-white"
          >
            View all outcomes &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
