import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { ulid } from 'ulid'
import { UserRepository } from '@/lib/db/queries/user'
import { conditions, event_tags, events, markets, outcomes, tags } from '@/lib/db/schema/events/tables'
import { db } from '@/lib/drizzle'

export async function POST(request: Request) {
  try {
    const currentUser = await UserRepository.getCurrentUser()
    if (!currentUser || !currentUser.is_admin) {
      return NextResponse.json({ error: 'Unauthenticated.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      start_date_iso,
      end_date_iso,
      icon,
      tags: eventTags,
      show_market_icons,
      resolution_source,
      markets: eventMarkets,
    } = body

    // 1. Validate required fields
    if (!title || !slug || !start_date_iso || !end_date_iso || !eventMarkets || eventMarkets.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const eventId = ulid()

    // 2. Insert Event
    await db.insert(events).values({
      id: eventId,
      slug,
      title,
      rules: description,
      icon_url: icon, // Assuming icon is already uploaded or is a URL
      show_market_icons,
      status: 'active',
      end_date: new Date(end_date_iso),
      creator: currentUser.wallet_address, // Use admin's wallet as creator
      total_markets_count: eventMarkets.length,
      active_markets_count: eventMarkets.length,
    })

    // 3. Process Tags
    if (eventTags && eventTags.length > 0) {
      for (const tag of eventTags) {
        // Find existing tag by slug
        const existingTags = await db.select().from(tags).where(eq(tags.slug, tag.slug))
        let tagId = existingTags[0]?.id

        // If not exists, create new tag
        if (!tagId) {
          const newTag = await db.insert(tags).values({
            name: tag.label,
            slug: tag.slug,
          }).returning({ id: tags.id })
          tagId = newTag[0].id
        }

        // Link tag to event
        await db.insert(event_tags).values({
          event_id: eventId,
          tag_id: tagId,
        })
      }
    }

    // 4. Process Markets, Conditions, and Outcomes
    for (let i = 0; i < eventMarkets.length; i++) {
      const market = eventMarkets[i]
      const conditionId = `local_${ulid()}` // Use a local prefix to distinguish from subgraph
      const questionId = `local_q_${ulid()}`

      // Insert Condition
      await db.insert(conditions).values({
        id: conditionId,
        oracle: 'local_admin',
        question_id: questionId,
        creator: currentUser.wallet_address,
      })

      // Insert Outcomes
      for (let j = 0; j < market.outcomes.length; j++) {
        const outcome = market.outcomes[j]
        const tokenId = `local_token_${conditionId}_${j}`

        await db.insert(outcomes).values({
          condition_id: conditionId,
          outcome_text: outcome.outcome,
          outcome_index: j,
          token_id: tokenId,
        })
      }

      // Insert Market
      await db.insert(markets).values({
        condition_id: conditionId,
        event_id: eventId,
        title: market.question,
        slug: market.market_slug || `${slug}-market-${i}`,
        question: market.question,
        market_rules: market.description,
        icon_url: market.icon,
        resolution_source: resolution_source || 'Local Events',
        is_active: true,
        is_resolved: false,
        end_time: new Date(end_date_iso),
      })
    }

    return NextResponse.json({ success: true, eventId })
  }
  catch (error: any) {
    console.error('Error creating local event:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
