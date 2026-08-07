import { NextRequest, NextResponse } from 'next/server'
import { supabase, getCurrentUser, getSubscription } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscription = await getSubscription(user.id)

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      subscription: subscription || { tier: 'free', status: 'active' },
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

/*
 * There was a POST handler here that took `tier` from the request body and
 * upserted it for the signed-in user — so anyone who found it could have made
 * themselves Pro by asking. Nothing called it. Row level security happened to
 * block the write, but that is a second line of defence doing the job of the
 * first.
 *
 * Entitlement is granted in exactly two places, both server-side and neither
 * reachable from a browser: the Stripe webhook, and scripts holding the direct
 * database connection. If a write endpoint is ever needed here, it must verify
 * the grant against Stripe rather than trust what the caller asked for.
 */
