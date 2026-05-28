'use client'
import Link from 'next/link'
import { modules } from '@/lib/course-content'

const testimonials = [
  {
    quote: "I wasn't sure exactly what I was looking for until I stumbled on Black Pharma. Patrice asked me: 'What is your aim?' She became more than a mentor — she became a friend, a guide, and a teacher.",
    name: "Gilbert Amoateng",
    role: "Pharmaceutical & Cosmetic Science Student",
    company: "MSD UK Placement"
  },
  {
    quote: "Joining as a student and now being early in my career, I can credit Black Pharma for their influence in making me dream and realise the opportunities as a Black person in the Pharma world!",
    name: "Rukayat Audu",
    role: "ORDP Analyst",
    company: "Roche HQ, Basel"
  },
  {
    quote: "The CULTIVATE programme gave me exposure to the pharmaceutical industry and provided the resources I needed to build a plan to navigate it.",
    name: "Adam Bukenya",
    role: "Biomedicine Graduate",
    company: "Cardiac Diagnostic Supervisor"
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* NAV */}
      <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-red w-8 h-8 rounded flex items-center justify-center font-bold text-lg">b</div>
          <span className="font-bold text-lg">Black Pharma</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-gray-300 hover:text-white text-sm transition-colors">Sign in</Link>
          <Link href="#pricing" className="btn-red text-sm px-5 py-2">Get access — £99</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-brand-red text-white px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider uppercase">
            Interactive Career Course
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Break Into<br />Pharma.
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-4 max-w-2xl">
            The Black Pharma Career Playbook — now an interactive course.
          </p>
          <p className="text-lg text-red-100 mb-10 max-w-2xl">
            A guided, step-by-step programme to discover your strengths, explore pharma careers, build your brand and land your first role.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#preview" className="bg-white text-brand-red font-bold px-8 py-4 rounded-lg hover:bg-red-50 transition-colors text-center">
              Preview Module 1 — Free
            </Link>
            <Link href="#pricing" className="bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors text-center">
              Get full access — £99
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-red-400">
            {[
              { num: '10,000+', label: 'Members & followers' },
              { num: '96%', label: 'Mentor satisfaction' },
              { num: '69', label: 'Countries reached' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-bold">{s.num}</div>
                <div className="text-red-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="px-6 py-20 bg-white" id="preview">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What's inside</h2>
          <p className="text-gray-600 mb-12 text-lg">Four modules, each with lessons, worksheets and real-world tools.</p>

          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div key={mod.id} className={`rounded-xl border-2 overflow-hidden ${mod.free ? 'border-brand-red' : 'border-gray-200'}`}>
                <div className={`px-6 py-4 flex items-center justify-between ${mod.free ? 'bg-brand-red text-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${mod.free ? 'bg-white text-brand-red' : 'bg-gray-200 text-gray-600'}`}>
                      0{mod.id}
                    </span>
                    <div>
                      <div className="font-bold text-lg">{mod.title}</div>
                      <div className={`text-sm ${mod.free ? 'text-red-100' : 'text-gray-500'}`}>{mod.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${mod.free ? 'bg-white text-brand-red' : 'bg-gray-200 text-gray-500'}`}>
                      {mod.free ? 'FREE PREVIEW' : `${mod.lessons.length} lessons`}
                    </span>
                    {mod.free && (
                      <Link href="/course/module-1" className="bg-black text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Start free →
                      </Link>
                    )}
                  </div>
                </div>
                <div className="px-6 py-3 bg-white">
                  <div className="flex flex-wrap gap-2">
                    {mod.lessons.slice(0, 4).map((lesson) => (
                      <span key={lesson.id} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {lesson.title}
                      </span>
                    ))}
                    {mod.lessons.length > 4 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                        +{mod.lessons.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What our community says</h2>
          <p className="text-gray-400 mb-12">Real stories from Black Pharma members.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-900 rounded-xl p-6 border-l-4 border-brand-red">
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-brand-red text-xs">{t.company}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 bg-white" id="pricing">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get full access</h2>
          <p className="text-gray-600 mb-10">One payment. Lifetime access. Start today.</p>

          <div className="border-2 border-brand-red rounded-2xl p-8 mb-6">
            <div className="text-5xl font-bold mb-2">£99</div>
            <div className="text-gray-500 mb-8">one-time payment</div>
            <ul className="text-left space-y-3 mb-8">
              {[
                'All 4 modules — 24 lessons',
                'Interactive worksheets',
                'Downloadable PDF playbook',
                'Pharma glossary & interview bank',
                'Application tracker',
                'Certificate of completion',
                'Lifetime access',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="text-brand-red font-bold text-lg">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <CheckoutButton />
          </div>

          <p className="text-xs text-gray-400">
            Secure payment via Stripe. Questions? Email partnerships@blackpharma.org
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-red w-8 h-8 rounded flex items-center justify-center font-bold">b</div>
            <div>
              <div className="font-bold">Black Pharma</div>
              <div className="text-gray-400 text-xs">CIC No: 13277801</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 Black Pharma · www.blackpharma.org · partnerships@blackpharma.org
          </div>
        </div>
      </footer>
    </div>
  )
}

function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch('/api/create-checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
  }
  return (
    <button onClick={handleCheckout} className="w-full btn-red text-lg py-4 rounded-xl">
      Buy now — £99
    </button>
  )
}
