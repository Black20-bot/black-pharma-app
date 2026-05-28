'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { modules } from '@/lib/course-content'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

export default function ModulePage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState(0)
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const mod = modules.find(m => m.slug === slug)

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const res = await fetch('/api/verify-payment')
      const { hasPurchased } = await res.json()
      setHasPurchased(hasPurchased)

      // Load saved progress
      const saved = localStorage.getItem(`bp_completed`)
      if (saved) setCompleted(new Set(JSON.parse(saved)))
      const answers = localStorage.getItem(`bp_answers`)
      if (answers) setWorksheetAnswers(JSON.parse(answers))

      setLoading(false)
    }
    init()
  }, [])

  if (!mod) return <div className="p-8 text-gray-400">Module not found.</div>
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>

  const canAccess = mod.free || hasPurchased
  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border-2 border-gray-200">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-3">This module is locked</h2>
          <p className="text-gray-500 mb-6">Get full access to all 4 modules for a one-time payment of £99.</p>
          <Link href="/#pricing" className="btn-red block rounded-xl py-4">Unlock for £99</Link>
          <Link href="/dashboard" className="text-gray-400 text-sm mt-4 block hover:text-gray-600">← Back to dashboard</Link>
        </div>
      </div>
    )
  }

  const lesson = mod.lessons[activeLesson]
  const progress = (completed.size / mod.lessons.length) * 100

  const markComplete = (lessonId: string) => {
    const next = new Set(completed)
    next.add(lessonId)
    setCompleted(next)
    localStorage.setItem('bp_completed', JSON.stringify([...next]))
  }

  const saveAnswer = (lessonId: string, value: string) => {
    const next = { ...worksheetAnswers, [lessonId]: value }
    setWorksheetAnswers(next)
    localStorage.setItem('bp_answers', JSON.stringify(next))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-black text-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-brand-red w-7 h-7 rounded flex items-center justify-center font-bold text-sm">b</div>
          <span className="text-sm text-gray-300">← Dashboard</span>
        </Link>
        <div className="text-sm text-gray-300">
          <span className="text-white font-medium">{mod.title}</span>
          <span className="mx-2">·</span>
          {mod.lessons.filter(l => completed.has(l.id)).length}/{mod.lessons.length} complete
        </div>
        <div className="w-32 progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="mb-4">
            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Module 0{mod.id}</div>
            <div className="font-bold text-sm">{mod.title}</div>
          </div>
          <div className="space-y-1">
            {mod.lessons.map((l, i) => (
              <button
                key={l.id}
                onClick={() => setActiveLesson(i)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${activeLesson === i ? 'bg-brand-red text-white' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs ${completed.has(l.id) ? 'bg-green-500 border-green-500 text-white' : activeLesson === i ? 'border-white' : 'border-gray-300'}`}>
                  {completed.has(l.id) ? '✓' : ''}
                </span>
                <span className="flex-1 leading-tight">{l.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">
          <div className="mb-2 text-sm text-gray-400">Lesson {activeLesson + 1} of {mod.lessons.length} · {lesson.duration}</div>
          <h1 className="text-3xl font-bold mb-6">{lesson.title}</h1>

          {lesson.content && (
            <div className="prose max-w-none mb-8">
              {lesson.content.split('\n\n').map((para, i) => {
                if (para.startsWith('**') && para.endsWith('**')) {
                  return <h3 key={i} className="font-bold text-lg mt-6 mb-3">{para.replace(/\*\*/g, '')}</h3>
                }
                if (para.startsWith('- ')) {
                  return (
                    <ul key={i} className="space-y-2 mb-4">
                      {para.split('\n').map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-700">
                          <span className="text-brand-red mt-1">▶</span>
                          <span>{item.replace('- ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  )
                }
                return <p key={i} className="text-gray-700 leading-relaxed mb-4">{para.replace(/\*\*/g, '')}</p>
              })}
            </div>
          )}

          {lesson.worksheet && (
            <div className="mb-8 rounded-xl overflow-hidden border-2 border-gray-200">
              <div className="bg-black text-white px-6 py-4">
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Worksheet</div>
                <div className="font-bold">{lesson.worksheet.title}</div>
              </div>
              <div className="p-6 bg-white">
                <p className="text-gray-500 text-sm mb-4">{lesson.worksheet.prompt}</p>
                <textarea
                  rows={lesson.worksheet.lines}
                  value={worksheetAnswers[lesson.id] ?? ''}
                  onChange={e => saveAnswer(lesson.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full border-2 border-gray-200 rounded-lg p-4 text-sm focus:border-brand-red outline-none transition-colors resize-none"
                />
                <div className="text-xs text-gray-400 mt-2">Your answers are saved automatically to this browser.</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
              disabled={activeLesson === 0}
              className="btn-outline text-sm px-5 py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <button
              onClick={() => {
                markComplete(lesson.id)
                if (activeLesson < mod.lessons.length - 1) {
                  setActiveLesson(activeLesson + 1)
                }
              }}
              className="btn-red text-sm px-6 py-2 rounded-lg"
            >
              {completed.has(lesson.id)
                ? activeLesson < mod.lessons.length - 1 ? 'Next lesson →' : 'Module complete ✓'
                : 'Mark complete & continue →'
              }
            </button>
          </div>

          {/* Completed module CTA */}
          {mod.lessons.every(l => completed.has(l.id)) && (
            <div className="mt-8 bg-black text-white rounded-xl p-6 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-bold text-lg mb-2">Module complete!</div>
              <p className="text-gray-400 text-sm mb-4">Well done. Keep going — the next module is waiting.</p>
              <Link href="/dashboard" className="btn-red inline-block px-6 py-3 rounded-lg text-sm">
                Back to dashboard →
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
