import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ hasPurchased: false })

  const { data } = await supabase
    .from('purchases')
    .select('id')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .limit(1)

  return NextResponse.json({ hasPurchased: (data?.length ?? 0) > 0 })
}
