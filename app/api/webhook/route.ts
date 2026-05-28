import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const userId = session.metadata?.userId
    const email = session.customer_email

    if (userId || email) {
      const supabase = createServerSupabaseClient()
      await supabase.from('purchases').upsert({
        user_id: userId,
        email: email,
        stripe_session_id: session.id,
        amount: session.amount_total,
        purchased_at: new Date().toISOString(),
      })
    }
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } }
