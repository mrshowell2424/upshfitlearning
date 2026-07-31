import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Create default free subscription
    if (data.user) {
      await supabase.from('subscriptions').insert({
        user_id: data.user.id,
        tier: 'free',
        status: 'active',
      })
    }

    return NextResponse.json({
      message: 'Sign up successful. Please check your email to confirm.',
      user: data.user,
    })
  } catch (error) {
    console.error('Sign-up error:', error)
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    )
  }
}
