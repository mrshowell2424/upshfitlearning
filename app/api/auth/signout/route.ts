import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await supabase.auth.signOut()

    return NextResponse.json({
      message: 'Signed out successfully',
    })
  } catch (error) {
    console.error('Sign-out error:', error)
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    )
  }
}
