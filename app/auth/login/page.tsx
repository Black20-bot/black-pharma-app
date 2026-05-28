'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand-red w-8 h-8 rounded flex items-center justify-center font-bold text-white">b</div>
          <span className="font-bold text-lg">Black Pharma</span>
        </div>

        {sent ? (
          <div>
            <h1 className="text-2xl font-bold mb-3">Check your email</h1>
            <p className="text-gray-600 mb-6">We sent a magic link to <strong>{email}</strong>. Click it to sign in — no password needed.</p>
            <button onClick={() => setSent(false)} className="text-brand-red text-sm underline">Use a different email</button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2">Sign in</h1>
            <p className="text-gray-500 text-sm mb-6">We'll send you a magic link — no password needed.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-brand-red outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-red py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link href="/" className="text-gray-400 text-sm hover:text-gray-600">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
