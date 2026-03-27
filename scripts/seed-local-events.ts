import { config } from 'dotenv'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { ulid } from 'ulid'
import { conditions, event_tags, events, markets, outcomes, tags } from '../src/lib/db/schema/events/tables'

config({ path: '.env' }) // Load environment variables

const connectionString = process.env.POSTGRES_URL!
if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is required')
}

const client = postgres(connectionString)
const db = drizzle(client)

const MOCK_CREATOR = '0x1234567890123456789012345678901234567890'

const sampleEvents = [
  // 1. Presidential & National Elections
  {
    title: 'Will Bola Ahmed Tinubu contest the 2027 presidential election?',
    slug: 'tinubu-contest-2027',
    description: 'This market resolves to Yes if incumbent President Bola Ahmed Tinubu officially declares his candidacy and is on the ballot for the 2027 presidential election.',
    icon: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800&auto=format&fit=crop', // Abstract vote/ballot representation
    endDate: new Date('2026-12-31T23:59:59Z'),
    tags: ['politics', 'trending'],
    markets: [{ title: 'Tinubu 2027', question: 'Will Tinubu contest in 2027?' }],
  },
  {
    title: 'Who will win the 2027 presidential election?',
    slug: 'winner-presidential-2027',
    description: 'This market predicts the winner of the 2027 Nigerian presidential election based on official INEC results.',
    icon: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=800&auto=format&fit=crop', // Crowd/election vibe
    endDate: new Date('2027-03-15T23:59:59Z'),
    tags: ['politics', 'trending'],
    markets: [
      {
        title: 'Presidential Winner',
        question: 'Who will win?',
        outcomes: ['APC Candidate', 'PDP Candidate', 'Labour Party Candidate'],
      },
    ],
  },
  {
    title: 'Will electronic transmission of results be fully implemented nationwide in 2027?',
    slug: 'inec-irev-2027',
    description: 'Resolves to Yes if INEC successfully transmits results electronically from over 95% of polling units in the 2027 presidential election.',
    icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop', // Data/tech transmission
    endDate: new Date('2027-03-01T23:59:59Z'),
    tags: ['politics', 'tech'],
    markets: [{ title: 'IReV fully implemented', question: 'Will IReV be used nationwide?' }],
  },

  // 2. Political Parties & Power Dynamics
  {
    title: 'Will the People’s Democratic Party regain majority influence before 2027?',
    slug: 'pdp-majority-2027',
    description: 'Resolves to Yes if PDP gains a majority in either the Senate or House of Representatives before the 2027 elections.',
    icon: 'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=800&auto=format&fit=crop', // Abstract politics/people
    endDate: new Date('2026-12-31T23:59:59Z'),
    tags: ['politics'],
    markets: [{ title: 'PDP Majority', question: 'Will PDP regain legislative majority?' }],
  },
  {
    title: 'Which party will control the majority in the Senate by 2026?',
    slug: 'senate-majority-2026',
    description: 'Predicts which political party will have the most seats in the Nigerian Senate by December 31, 2026.',
    icon: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=800&auto=format&fit=crop', // Building/parliament vibe
    endDate: new Date('2026-12-31T23:59:59Z'),
    tags: ['politics'],
    markets: [
      {
        title: 'Senate Majority',
        question: 'Which party will control the Senate?',
        outcomes: ['APC', 'PDP', 'Labour Party'],
      },
    ],
  },

  // 4. Economy & Policy
  {
    title: 'Will fuel subsidy be reintroduced before 2027?',
    slug: 'fuel-subsidy-return-2027',
    description: 'Resolves to Yes if the Federal Government officially announces a return to a subsidized petroleum pricing regime before 2027.',
    icon: 'https://images.unsplash.com/photo-1527018263358-2ba15af416d8?q=80&w=800&auto=format&fit=crop', // Fuel pump
    endDate: new Date('2026-12-31T23:59:59Z'),
    tags: ['economy', 'politics', 'trending'],
    markets: [{ title: 'Subsidy Reintroduced', question: 'Will fuel subsidy return?' }],
  },
  {
    title: 'Will the Nigerian Naira (NGN) strengthen below ₦1,000/$1 before 2026?',
    slug: 'ngn-stronger-1000-2026',
    description: 'Resolves to Yes if the official CBN exchange rate drops below 1,000 Naira per US Dollar at any point before January 1, 2026.',
    icon: 'https://images.unsplash.com/photo-1622630998477-20b41cd0e071?q=80&w=800&auto=format&fit=crop', // Currency/money
    endDate: new Date('2025-12-31T23:59:59Z'),
    tags: ['economy', 'trending'],
    markets: [{ title: 'Naira < ₦1000/$', question: 'Will NGN drop below 1000/USD?' }],
  },

  // 5. Oil, Security & Governance
  {
    title: 'Will Nigeria meet OPEC production quota for 3 consecutive months before 2026?',
    slug: 'nigeria-opec-quota-2026',
    description: 'Resolves to Yes if Nigeria successfully meets or exceeds its allocated OPEC oil production quota for any three consecutive months before 2026.',
    icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', // Oil rig/industry
    endDate: new Date('2025-12-31T23:59:59Z'),
    tags: ['economy', 'oil'],
    markets: [{ title: 'OPEC Quota Met', question: 'Will Nigeria hit OPEC target?' }],
  },

  // 7. Key Political Figures
  {
    title: 'Will Peter Obi remain in the Labour Party through 2026?',
    slug: 'peter-obi-lp-2026',
    description: 'Resolves to Yes if Peter Obi does not defect from the Labour Party to another political party before December 31, 2026.',
    icon: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop', // Abstract person/leadership
    endDate: new Date('2026-12-31T23:59:59Z'),
    tags: ['politics', 'trending'],
    markets: [{ title: 'Obi stays in LP', question: 'Will Peter Obi remain in LP?' }],
  },
  {
    title: 'Which geopolitical zone will produce the next president in 2027?',
    slug: 'president-zone-2027',
    description: 'Predicts the geopolitical zone of origin for the winner of the 2027 presidential election.',
    icon: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop', // Map/globe concept
    endDate: new Date('2027-03-15T23:59:59Z'),
    tags: ['politics'],
    markets: [
      {
        title: 'Geopolitical Zone',
        question: 'Which zone will win?',
        outcomes: ['South-West', 'North-West', 'South-East', 'South-South'],
      },
    ],
  },

  // 9. Risk & Stability Indicators
  {
    title: 'Will a nationwide protest movement occur before 2027?',
    slug: 'nationwide-protest-2027',
    description: 'Resolves to Yes if a major, coordinated nationwide protest (similar to EndSARS) occurs before the 2027 elections.',
    icon: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop', // Protest/crowd
    endDate: new Date('2026-12-31T23:59:59Z'),
    tags: ['politics', 'society'],
    markets: [{ title: 'Nationwide Protest', question: 'Will there be a major nationwide protest?' }],
  },
]

async function seed() {
  console.log('Seeding local Nigerian events...')

  // Force update existing events to fix image URLs and outcomes
  for (const eventData of sampleEvents) {
    const existingEvent = await db.select().from(events).where(eq(events.slug, eventData.slug))

    if (existingEvent.length > 0) {
      console.log(`Updating existing event: ${eventData.slug}`)
      await db.update(events)
        .set({ icon_url: eventData.icon })
        .where(eq(events.slug, eventData.slug))

      await db.update(markets)
        .set({
          icon_url: eventData.icon,
          resolution_source: 'Local Events',
        })
        .where(eq(markets.event_id, existingEvent[0].id))

      // Update outcomes if it's a multi-outcome market
      if ('outcomes' in eventData.markets[0] && eventData.markets[0].outcomes) {
        // To properly reset, we need to delete old outcomes and recreate them for the market's condition
        const existingMarkets = await db.select().from(markets).where(eq(markets.event_id, existingEvent[0].id))
        for (const m of existingMarkets) {
          await db.delete(outcomes).where(eq(outcomes.condition_id, m.condition_id))

          for (let j = 0; j < eventData.markets[0].outcomes.length; j++) {
            const outcomeText = eventData.markets[0].outcomes[j]
            await db.insert(outcomes).values({
              condition_id: m.condition_id,
              outcome_text: outcomeText,
              outcome_index: j,
              token_id: `local_token_${m.condition_id}_${j}`,
              // buy_price and sell_price were removed as they aren't in schema
            }).onConflictDoNothing()
          }
        }
      }

      continue
    }

    const eventId = ulid()

    // Create Event
    await db.insert(events).values({
      id: eventId,
      slug: eventData.slug,
      title: eventData.title,
      rules: eventData.description,
      icon_url: eventData.icon,
      status: 'active',
      end_date: eventData.endDate,
      creator: MOCK_CREATOR,
      total_markets_count: eventData.markets.length,
      active_markets_count: eventData.markets.length,
    }).onConflictDoNothing()

    // Process Tags
    for (const tagSlug of eventData.tags) {
      const tagRecord = await db.select().from(tags).where(eq(tags.slug, tagSlug))
      let tagId = tagRecord[0]?.id

      if (!tagId) {
        const newTag = await db.insert(tags).values({
          name: tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1),
          slug: tagSlug,
        }).returning({ id: tags.id })
        tagId = newTag[0].id
      }

      await db.insert(event_tags).values({
        event_id: eventId,
        tag_id: tagId,
      }).onConflictDoNothing()
    }

    // Process Markets
    for (let i = 0; i < eventData.markets.length; i++) {
      const marketData = eventData.markets[i]
      const conditionId = `local_cond_${ulid()}`
      const questionId = `local_q_${ulid()}`

      await db.insert(conditions).values({
        id: conditionId,
        oracle: 'local_admin',
        question_id: questionId,
        creator: MOCK_CREATOR,
      }).onConflictDoNothing()

      if ('outcomes' in marketData && marketData.outcomes) {
        for (let j = 0; j < marketData.outcomes.length; j++) {
          const outcomeText = marketData.outcomes[j]
          await db.insert(outcomes).values({
            condition_id: conditionId,
            outcome_text: outcomeText,
            outcome_index: j,
            token_id: `local_token_${conditionId}_${j}`,
          }).onConflictDoNothing()
        }
      }
      else {
        // Default to Yes/No if no custom outcomes provided
        await db.insert(outcomes).values({
          condition_id: conditionId,
          outcome_text: 'Yes',
          outcome_index: 0,
          token_id: `local_token_${conditionId}_yes`,
        }).onConflictDoNothing()

        await db.insert(outcomes).values({
          condition_id: conditionId,
          outcome_text: 'No',
          outcome_index: 1,
          token_id: `local_token_${conditionId}_no`,
        }).onConflictDoNothing()
      }

      await db.insert(markets).values({
        condition_id: conditionId,
        event_id: eventId,
        title: marketData.title,
        slug: `${eventData.slug}-market-${i}`,
        question: marketData.question,
        market_rules: eventData.description,
        icon_url: eventData.icon,
        resolution_source: 'Local Events',
        is_active: true,
        is_resolved: false,
        end_time: eventData.endDate,
        volume: '15000000', // Mock volume in NGN
        volume_24h: '500000', // Mock 24h volume
      }).onConflictDoNothing()
    }

    console.log(`✅ Seeded event: ${eventData.title}`)
  }

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seeding failed:', err)
  process.exit(1)
})
