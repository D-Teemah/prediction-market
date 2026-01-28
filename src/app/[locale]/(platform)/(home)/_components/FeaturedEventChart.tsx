'use client'

import type { Event } from '@/types'
import type { PredictionChartProps, SeriesConfig } from '@/types/PredictionChartTypes'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildMarketTargets,
  useEventPriceHistory,
} from '@/app/[locale]/(platform)/event/[slug]/_hooks/useEventPriceHistory'
import { Skeleton } from '@/components/ui/skeleton'

const PredictionChart = dynamic<PredictionChartProps>(
  () => import('@/components/PredictionChart').then(mod => mod.PredictionChart),
  { ssr: false, loading: () => <Skeleton className="h-[200px] w-full bg-white/10" /> },
)

export default function FeaturedEventChart({ event }: { event: Event }) {
  const primaryMarket = event.markets[0]
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width) {
          setWidth(entry.contentRect.width)
        }
      }
    })
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const marketTargets = useMemo(() => {
    if (!primaryMarket) {
      return []
    }
    return buildMarketTargets([primaryMarket])
  }, [primaryMarket])

  const {
    normalizedHistory,
  } = useEventPriceHistory({
    eventId: event.id,
    range: 'ALL',
    targets: marketTargets,
    eventCreatedAt: event.created_at,
  })

  const chartData = useMemo(() => normalizedHistory ?? [], [normalizedHistory])

  const series = useMemo<SeriesConfig[]>(() => {
    if (!primaryMarket) {
      return []
    }

    return [{
      key: primaryMarket.condition_id,
      name: 'Yes',
      color: '#4CAF50', // Green line
    }]
  }, [primaryMarket])

  if (!primaryMarket) {
    return <div className="h-[200px] w-full rounded-xl bg-white/5" />
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[200px] w-full overflow-hidden rounded-xl border border-white/10 bg-black backdrop-blur-sm"
    >
      <div className={`
        absolute inset-0
        bg-[linear-gradient(to_right,#ff000033_1px,transparent_1px),linear-gradient(to_bottom,#ff000033_1px,transparent_1px)]
        bg-[size:20px_20px]
      `}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#ff000022,transparent)]" />
      <PredictionChart
        data={chartData}
        series={series}
        width={width}
        height={200}
        margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
        showXAxis={false}
        showYAxis={false}
        showHorizontalGrid={false}
        showVerticalGrid={false}
        showLegend={false}
        showAnnotations={false}
        autoscale={true}
      />
    </div>
  )
}
