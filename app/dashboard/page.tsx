'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { modules } from '@/lib/course-content'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const res = await fetch('/api/verify-payment')
      const { hasPurchased } = await res.json()
      setHasPurchased(hasPurchased)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-red w-8 h-8 rounded flex items-center justify-center font-bold">b</div>
          <span className="font-bold">Black Pharma</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.email}</span>
          <button onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
          }} className="text-gray-400 hover:text-white text-sm transition-colors">Sign out</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Welcome back</h1>
          <p className="text-gray-500">Your pharma career journey starts here.</p>
        </div>

        {!hasPurchased && (
          <div className="bg-brand-red text-white rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <div className="font-bold text-lg mb-1">Unlock the full course</div>
              <div className="text-red-100 text-sm">You have free access to Module 1. Get all 4 modules for £99.</div>
            </div>
            <Link href="/#pricing" className="bg-white text-brand-red font-bold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Buy now — £99
            </Link>
          </div>
        )}

        {/* Modules grid */}
        <div className="grid gap-4">
          {modules.map((mod) => {
            const locked = !mod.free && !hasPurchased
            return (
              <div key={mod.id} className={`bg-white rounded-xl border-2 overflow-hidden ${locked ? 'border-gray-100 opacity-75' : 'border-gray-200 hover:border-brand-red transition-colors'}`}>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${locked ? 'bg-gray-100 text-gray-400' : 'bg-brand-red text-white'}`}>
                      0{mod.id}
                    </div>
                    <div>
                      <div className="font-bold">{mod.title}</div>
                      <div className="text-gray-500 text-sm">{mod.subtitle} · {mod.lessons.length} lessons</div>
                    </div>
                  </div>
                  {locked ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span>🔒</span> Locked
                    </div>
                  ) : (
                    <Link href={`/course/${mod.slug}`} className="btn-red text-sm px-5 py-2 rounded-lg">
                      Start →
                    </Link>
                  )}
                </div>
                {!locked && (
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {mod.lessons.slice(0, 3).map(l => (
                        <span key={l.id} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded">{l.title}</span>
                      ))}
                      {mod.lessons.length > 3 && (
                        <span className="text-xs text-gray-400">+{mod.lessons.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {hasPurchased && (
          <div className="mt-8 bg-white border-2 border-gray-200 rounded-xl p-6 flex items-center justify-between">
            <div>
              <div className="font-bold mb-1">Download the PDF Playbook</div>
              <div className="text-gray-500 text-sm">Your complete reference guide to take anywhere.</div>
            </div>
            <a href="/playbook.pdf" download className="btn-black text-sm px-5 py-2 rounded-lg">
              Download PDF
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
