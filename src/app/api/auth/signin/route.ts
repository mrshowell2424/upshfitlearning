import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    // Create default subscription for new user if it doesn't exist
    if (data.user) {
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', data.user.id)
        .single()

      if (!existingSub) {
        await supabase.from('subscriptions').insert({
          user_id: data.user.id,
          tier: 'free',
          status: 'active',
        })
      }
    }

    return NextResponse.json({
      message: 'Signed in successfully',
      user: data.user,
    })
  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    )
  }
}
