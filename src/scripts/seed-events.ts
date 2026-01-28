import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
// Helper for 'eq' which I forgot to import
import { eq } from 'drizzle-orm'
import { conditions, event_tags, events, markets, outcomes, tags } from '@/lib/db/schema'

import { db } from '@/lib/drizzle'

// Manually load .env if not present (for POSTGRES_URL)
if (!process.env.POSTGRES_URL) {
  const envFiles = ['.env.local', '.env']
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file)
    if (fs.existsSync(envPath)) {
      console.log(`Loading env from ${file}`)
      const envConfig = fs.readFileSync(envPath, 'utf-8')
      envConfig.split('\n').forEach((line) => {
        const [key, value] = line.split('=')
        if (key && value && !process.env[key.trim()]) {
          process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
        }
      })
    }
  }
}

// Prefer non-pooling URL for seeding if available
if (process.env.POSTGRES_URL_NON_POOLING) {
  console.log('Using POSTGRES_URL_NON_POOLING for seeding...')
  process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING
}

if (!process.env.POSTGRES_URL) {
  console.error('❌ POSTGRES_URL not found in environment variables')
  process.exit(1)
}

function generateId(length: number = 26): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

function generateHex(length: number = 42): string {
  return `0x${crypto.randomBytes(Math.ceil((length - 2) / 2)).toString('hex')}`
}

const SOURCES = [
  {
    name: 'Global News',
    slug: 'global-news',
    events: [
      {
        title: 'Will the US Inflation Rate drop below 2% in 2026?',
        slug: 'us-inflation-below-2-percent-2026',
        question: 'Will the US CPI inflation rate be reported as strictly less than 2.0% for any month in 2026?',
        outcomes: ['Yes', 'No'],
      },
      {
        title: 'Who will win the 2028 US Presidential Election?',
        slug: 'us-election-winner-2028',
        question: 'Which party candidate will win the 2028 US Presidential Election?',
        outcomes: ['Democrat', 'Republican', 'Other'],
      },
      {
        title: 'Will GPT-6 be released before Q4 2026?',
        slug: 'gpt-6-release-date',
        question: 'Will OpenAI release GPT-6 to the public before October 1st, 2026?',
        outcomes: ['Yes', 'No'],
      },
    ],
  },
  {
    name: 'Sports Oracle',
    slug: 'sports-oracle',
    events: [
      {
        title: 'Lakers vs Warriors: Who wins?',
        slug: 'lakers-vs-warriors-2026-game',
        question: 'Who will win the NBA game between Los Angeles Lakers and Golden State Warriors on Feb 10, 2026?',
        outcomes: ['Lakers', 'Warriors'],
      },
      {
        title: 'Super Bowl LXI Winner',
        slug: 'super-bowl-lxi-winner',
        question: 'Which team will win Super Bowl LXI?',
        outcomes: ['Chiefs', '49ers', 'Lions', 'Bills', 'Other'],
      },
      {
        title: 'Champions League 2026 Winner',
        slug: 'champions-league-2026-winner',
        question: 'Who will win the UEFA Champions League 2025-2026?',
        outcomes: ['Real Madrid', 'Man City', 'Bayern Munich', 'Arsenal'],
      },
    ],
  },
]

async function fetchGDELTEvents() {
  console.log('Fetching GDELT events...')
  try {
    const res = await fetch('https://api.gdeltproject.org/api/v2/doc/doc?query=election&mode=artlist&format=json&maxrecords=5&timespan=1w')
    if (!res.ok) {
      throw new Error(`GDELT API error: ${res.statusText}`)
    }
    const data = await res.json() as any

    const events = []
    if (data.articles && Array.isArray(data.articles)) {
      for (const article of data.articles) {
        const title = article.title || 'Untitled Event'
        // Simple slug generation
        const slug = `gdelt-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50)}-${generateId(4)}`

        events.push({
          title,
          slug,
          question: `Will the event described in "${title}" have a significant outcome by the end of the year?`,
          outcomes: ['Yes', 'No', 'Uncertain'],
        })
      }
    }

    return {
      name: 'GDELT Project',
      slug: 'gdelt-project',
      events,
    }
  }
  catch (err) {
    console.error('Failed to fetch GDELT events:', err)
    return { name: 'GDELT Project', slug: 'gdelt-project', events: [] }
  }
}

async function fetchRSSEvents() {
  console.log('Fetching BBC RSS events...')
  try {
    const res = await fetch('http://feeds.bbci.co.uk/news/world/rss.xml')
    if (!res.ok) {
      throw new Error(`RSS fetch error: ${res.statusText}`)
    }
    const xml = await res.text()

    const events = []
    // Simple regex to find items
    const itemRegex = /<item>[\s\S]*?<\/item>/g
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/

    const items = xml.match(itemRegex) || []
    for (const item of items.slice(0, 5)) {
      const titleMatch = item.match(titleRegex)
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Unknown News'

      const slug = `bbc-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50)}-${generateId(4)}`

      events.push({
        title,
        slug,
        question: `Will "${title}" lead to major policy changes?`,
        outcomes: ['Yes', 'No'],
      })
    }

    return {
      name: 'BBC World News',
      slug: 'bbc-world-news',
      events,
    }
  }
  catch (err) {
    console.error('Failed to fetch RSS events:', err)
    return { name: 'BBC World News', slug: 'bbc-world-news', events: [] }
  }
}

async function seed() {
  console.log('🌱 Starting seed process...')

  const gdeltSource = await fetchGDELTEvents()
  const rssSource = await fetchRSSEvents()

  const allSources = [...SOURCES, gdeltSource, rssSource]

  for (const source of allSources) {
    console.log(`\nProcessing source: ${source.name}`)

    // 1. Create or Get Tag
    let tagId: number
    const existingTags = await db.select().from(tags).where(eq(tags.slug, source.slug))

    if (existingTags.length > 0) {
      tagId = existingTags[0].id
      console.log(`  ✓ Tag '${source.name}' exists (ID: ${tagId})`)
    }
    else {
      const inserted = await db.insert(tags).values({
        name: source.name,
        slug: source.slug,
        is_main_category: true,
        display_order: 10,
      }).returning({ id: tags.id })
      tagId = inserted[0].id
      console.log(`  ✓ Created tag '${source.name}' (ID: ${tagId})`)
    }

    // 2. Create Events
    for (const eventData of source.events) {
      const conditionId = generateHex(66)
      const questionId = generateHex(66)

      // Create Condition
      await db.insert(conditions).values({
        id: conditionId,
        oracle: generateHex(42),
        question_id: questionId,
        creator: generateHex(42),
        arweave_hash: generateHex(43),
        resolved: false,
      }).onConflictDoNothing()

      // Create Event
      const insertedEvent = await db.insert(events).values({
        title: eventData.title,
        slug: eventData.slug,
        status: 'active',
        active_markets_count: 1,
        total_markets_count: 1,
      }).returning({ id: events.id }).onConflictDoNothing()

      let eventId: string
      if (insertedEvent.length > 0) {
        eventId = insertedEvent[0].id
        console.log(`  ✓ Created event: ${eventData.title}`)
      }
      else {
        const existing = await db.select().from(events).where(eq(events.slug, eventData.slug))
        if (existing.length === 0) {
          continue
        }
        eventId = existing[0].id
        console.log(`  ✓ Event exists: ${eventData.title}`)
      }

      // Link Tag
      await db.insert(event_tags).values({
        event_id: eventId,
        tag_id: tagId,
      }).onConflictDoNothing()

      // Create Market
      await db.insert(markets).values({
        condition_id: conditionId,
        event_id: eventId,
        title: eventData.title,
        slug: eventData.slug,
        question: eventData.question,
        icon_url: '/images/default-market.png',
        is_active: true,
        is_resolved: false,
      }).onConflictDoNothing()

      // Create Outcomes
      for (let i = 0; i < eventData.outcomes.length; i++) {
        await db.insert(outcomes).values({
          condition_id: conditionId,
          outcome_text: eventData.outcomes[i],
          outcome_index: i,
          token_id: generateHex(66),
          current_price: (100 / eventData.outcomes.length / 100).toFixed(4),
        }).onConflictDoNothing()
      }
    }
  }

  console.log('\n✅ Seeding completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
