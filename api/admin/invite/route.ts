import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const serverSupabase = await createServerClient()
    const { data: { user } } = await serverSupabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { data: profile } = await serverSupabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin' || profile.status !== 'approved') {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const { email, role = 'author' } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'E-Mail ist erforderlich' }, { status: 400 })
    }

    const adminSupabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: existingUser } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Ein Nutzer mit dieser E-Mail existiert bereits' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/admin/einladung`,
      data: {
        invited_role: role,
        invited_by: user.id
      }
    })

    if (error) {
      console.error('Invite error:', error)
      return NextResponse.json({ error: 'Fehler beim Senden der Einladung: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Einladung wurde gesendet',
      user_id: data.user.id
    })

  } catch (error) {
    console.error('Invite error:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
