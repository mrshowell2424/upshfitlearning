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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tier, status } = await request.json()

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          tier,
          status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Subscription updated',
      subscription: data,
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}
