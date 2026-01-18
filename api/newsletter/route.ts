import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Bitte gib eine gültige E-Mail-Adresse ein.' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({ email, confirmed: true })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Diese E-Mail ist bereits angemeldet.' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Ein Fehler ist aufgetreten.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}
