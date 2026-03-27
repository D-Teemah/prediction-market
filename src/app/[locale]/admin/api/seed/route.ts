import { NextResponse } from 'next/server'
import { executeSeedLocalEvents } from './service'

export async function POST(request: Request) {
  try {
    // Basic security: require an API key in the headers
    // In production, you'd pass this as an Authorization header
    const authHeader = request.headers.get('Authorization')
    const expectedKey = `Bearer ${process.env.CRON_SECRET || 'secret'}`

    if (authHeader !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing Bearer token.' },
        { status: 401 },
      )
    }

    const result = await executeSeedLocalEvents()

    return NextResponse.json(result)
  }
  catch (error: any) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to execute seed script' },
      { status: 500 },
    )
  }
}
