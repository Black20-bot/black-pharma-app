"use client";

import { useState, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const DEGREES = [
  "Biochemistry", "Biology", "Biomedical Engineering", "Biotechnology",
  "Chemistry", "Chemical Engineering", "Computer Science", "Data Science",
  "Environmental Science", "Genetics", "Mathematics", "Medicine / MBChB",
  "Microbiology", "Neuroscience", "Nursing", "Pharmacology", "Physics",
  "Psychology", "Statistics", "Other STEM",
];

const EXPERIENCE_GROUPS = [
  {
    label: "Research & Science", icon: "🔬",
    items: ["Wet lab / bench research", "Animal or cell models", "Bioinformatics / computational biology",
      "Literature reviews & meta-analyses", "Clinical trials participation", "Academic research project"],
  },
  {
    label: "Clinical & Patient-Facing", icon: "🏥",
    items: ["Hospital / GP clinical placement", "Patient-facing care", "Community health work",
      "Mental health support", "Pharmacy dispensing", "Operating theatre / surgical exposure"],
  },
  {
    label: "Data & Technology", icon: "💻",
    items: ["Statistical analysis (R / Python / SPSS)", "Software / app development",
      "Data visualisation", "Machine learning / AI", "Database management", "Electronic health records"],
  },
  {
    label: "Industry & Business", icon: "🏢",
    items: ["Pharma / biotech internship", "Sales or account management", "Marketing or communications",
      "Project or programme management", "Regulatory affairs / submissions", "Quality assurance / GMP"],
  },
  {
    label: "Communication & Leadership", icon: "🎙️",
    items: ["Scientific writing / publishing", "Teaching or tutoring", "Public outreach / science comms",
      "Society or committee leadership", "Grant or funding applications", "Conference presenting"],
  },
];

const INTERESTS = [
  "Working with patients", "Drug discovery & development", "Data & technology",
  "Business strategy & consulting", "Field-based / travel", "Research & publishing",
  "Regulation & health policy", "Education & training", "Product development",
  "Commercial / sales", "Operations & logistics", "Medical writing & comms",
];

const SECTORS = [
  { id: "all",    label: "All sectors",      icon: "🌐" },
  { id: "pharma", label: "Pharma & Biotech",  icon: "💊" },
  { id: "nhs",    label: "NHS & Healthcare",  icon: "🏥" },
  { id: "tech",   label: "Health Tech & AI",  icon: "💻" },
  { id: "cro",    label: "CRO & Consultancy", icon: "🔬" },
  { id: "gov",    label: "Govt & Regulation", icon: "🏛️" },
];

const TOTAL_STEPS = 4;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Role {
  title: string;
  sector: string;
  fit: "High" | "Medium";
  why: string;
  trajectory: string[];
  salary_range: string;
  skills_to_build: string[];
  certifications: string[];
  example_employers: string[];
}

interface Results {
  summary: string;
  roles: Role[];
  top_tip: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ExperienceGroup({
  group,
  selected,
  onToggle,
}: {
  group: (typeof EXPERIENCE_GROUPS)[number];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const count = group.items.filter((i) => selected.includes(i)).length;
  return (
    <div className="bp-exp-group">
      <div className="bp-exp-header" onClick={() => setOpen((o) => !o)}>
        <span style={{ fontSize: 20 }}>{group.icon}</span>
        <span className="bp-exp-label">{group.label}</span>
        {count > 0 && <span className="bp-exp-count">{count}</span>}
        <span
          style={{
            color: "var(--slate)",
            fontSize: 12,
            marginLeft: 8,
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▾
        </span>
      </div>
      {open && (
        <div className="bp-exp-body">
          {group.items.map((item) => (
            <button
              key={item}
              className={`bp-chip ${selected.includes(item) ? "selected" : ""}`}
              onClick={() => onToggle(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CareerNavigator() {
  const [step, setStep] = useState(0);
  const [degree, setDegree] = useState("");
  const [otherDegree, setOtherDegree] = useState("");
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState("all");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const degreeLabel = degree === "Other STEM" ? otherDegree || "STEM subject" : degree;
  const sectorLabel = SECTORS.find((s) => s.id === selectedSector)?.label || "All sectors";

  const generateResults = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/career-navigator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          degree: degreeLabel,
          experiences: selectedExperiences,
          interests: selectedInterests,
          sector: selectedSector,
          sectorLabel,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const parsed: Results = await res.json();
      setResults(parsed);
      setStep(5);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(0);
    setDegree("");
    setOtherDegree("");
    setSelectedExperiences([]);
    setSelectedInterests([]);
    setSelectedSector("all");
    setResults(null);
    setError("");
  };

  const handleCopy = () => {
    if (!results) return;
    const roleList = results.roles?.map((r) => `• ${r.title} (${r.sector}) — ${r.fit} fit`).join("\n") || "";
    const text = `Black Pharma Career Navigator Results\n\nDegree: ${degreeLabel}\nSector: ${sectorLabel}\n\n${results.summary}\n\nBest-fit roles:\n${roleList}\n\n💡 ${results.top_tip}\n\n— blackpharma.org`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      showToast("Results copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const progressPct =
    step === 0 ? 0 : step >= 5 ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --red: #ff3b3f;
          --red-dim: rgba(255,59,63,0.12);
          --red-border: rgba(255,59,63,0.28);
          --black: #000000;
          --dark: #0e0e0e;
          --card: #141414;
          --card2: #1a1a1a;
          --border: #252525;
          --border2: #2e2e2e;
          --slate: #8689a6;
          --slate-dim: rgba(134,137,166,0.15);
          --text: #f0f0f0;
          --text-muted: #888;
          --text-dim: #555;
          --white: #ffffff;
          --green: #22c55e;
          --green-dim: rgba(34,197,94,0.1);
          --green-border: rgba(34,197,94,0.25);
          --amber: #f59e0b;
          --amber-dim: rgba(245,158,11,0.1);
          --amber-border: rgba(245,158,11,0.22);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bp-wrap {
          min-height: 100vh;
          background: var(--black);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow-x: hidden;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

        /* ── Header ── */
        .bp-header {
          padding: 18px 32px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(12px);
          z-index: 20;
        }

        .bp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bp-logo-mark {
          width: 32px;
          height: 32px;
          background: var(--red);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: white;
          font-style: italic;
          letter-spacing: -1px;
        }

        .bp-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 15px;
          color: var(--white);
          line-height: 1.1;
        }

        .bp-logo-sub {
          font-size: 9px;
          color: var(--text-dim);
          letter-spacing: 0.15em;
          font-weight: 400;
        }

        /* ── Progress ── */
        .bp-progress {
          height: 2px;
          background: var(--border);
        }
        .bp-progress-fill {
          height: 100%;
          background: var(--red);
          transition: width 0.4s ease;
        }

        /* ── Page content ── */
        .bp-content {
          max-width: 720px;
          margin: 0 auto;
          padding: 52px 24px 100px;
        }

        /* ── Step label ── */
        .bp-step-label {
          font-size: 11px;
          color: var(--red);
          letter-spacing: 0.14em;
          font-weight: 600;
          margin-bottom: 12px;
          font-family: 'Syne', sans-serif;
        }

        /* ── Headings ── */
        .bp-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5.5vw, 54px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .bp-h2 {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .bp-red { color: var(--red); }

        .bp-body {
          color: var(--text-muted);
          font-size: 15px;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 480px;
        }

        /* ── Buttons ── */
        .bp-btn-primary {
          background: var(--red);
          border: none;
          border-radius: 8px;
          padding: 13px 30px;
          color: #fff;
          font-size: 15px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
          letter-spacing: 0.02em;
        }
        .bp-btn-primary:hover { background: #e02e32; transform: translateY(-1px); }
        .bp-btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

        .bp-btn-ghost {
          background: transparent;
          border: 1px solid var(--border2);
          border-radius: 8px;
          padding: 12px 22px;
          color: var(--text-muted);
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
        }
        .bp-btn-ghost:hover { border-color: var(--slate); color: var(--text); }

        .bp-btn-action {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 9px 16px;
          color: var(--text-muted);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.18s;
        }
        .bp-btn-action:hover { border-color: var(--red-border); color: var(--red); }

        /* ── Degree select ── */
        .bp-select {
          background: var(--card);
          border: 1px solid var(--border2);
          border-radius: 8px;
          padding: 13px 40px 13px 16px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          width: 100%;
          max-width: 420px;
          cursor: pointer;
          appearance: none;
          outline: none;
          transition: border-color 0.18s;
        }
        .bp-select:focus { border-color: var(--red); }
        .bp-select option { background: var(--card); }

        .bp-input {
          background: var(--card);
          border: 1px solid var(--border2);
          border-radius: 8px;
          padding: 12px 16px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          max-width: 360px;
          outline: none;
          transition: border-color 0.18s;
        }
        .bp-input:focus { border-color: var(--red); }
        .bp-input::placeholder { color: var(--text-dim); }

        /* ── Chips ── */
        .bp-chip {
          padding: 8px 15px;
          border-radius: 6px;
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .bp-chip:hover { border-color: var(--red-border); color: var(--text); }
        .bp-chip.selected {
          border-color: var(--red);
          background: var(--red-dim);
          color: #ff8385;
        }

        /* ── Sector chips ── */
        .bp-sector-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 8px;
          border: 1px solid var(--border2);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          text-align: left;
        }
        .bp-sector-chip:hover { border-color: var(--red-border); color: var(--text); background: rgba(255,59,63,0.04); }
        .bp-sector-chip.selected {
          border-color: var(--red);
          background: var(--red-dim);
          color: #ff8385;
        }

        /* ── Experience groups ── */
        .bp-exp-group {
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        .bp-exp-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: var(--card);
          cursor: pointer;
          user-select: none;
          transition: background 0.15s;
        }
        .bp-exp-header:hover { background: var(--card2); }
        .bp-exp-label { font-size: 14px; font-weight: 500; color: var(--text); flex: 1; }
        .bp-exp-count {
          font-size: 11px;
          padding: 2px 9px;
          border-radius: 10px;
          background: var(--red-dim);
          color: var(--red);
          border: 1px solid var(--red-border);
          font-weight: 600;
        }
        .bp-exp-body {
          padding: 14px 18px 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          background: var(--dark);
        }

        /* ── Role cards ── */
        .bp-role-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 26px;
          transition: all 0.2s;
        }
        .bp-role-card:hover {
          border-color: var(--red-border);
          transform: translateY(-2px);
        }

        /* ── Tags ── */
        .bp-tag {
          display: inline-block;
          padding: 3px 11px;
          border-radius: 5px;
          font-size: 11.5px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          letter-spacing: 0.03em;
        }
        .bp-tag-high {
          background: var(--green-dim);
          color: var(--green);
          border: 1px solid var(--green-border);
        }
        .bp-tag-medium {
          background: var(--amber-dim);
          color: var(--amber);
          border: 1px solid var(--amber-border);
        }

        /* ── Pills ── */
        .bp-pill {
          font-size: 11.5px;
          padding: 3px 10px;
          border-radius: 5px;
        }
        .bp-pill-skill {
          background: rgba(134,137,166,0.1);
          color: var(--slate);
          border: 1px solid rgba(134,137,166,0.2);
        }
        .bp-pill-cert {
          background: var(--red-dim);
          color: #ff8385;
          border: 1px solid var(--red-border);
        }
        .bp-pill-employer {
          background: rgba(255,255,255,0.04);
          color: var(--text-dim);
          border: 1px solid var(--border);
        }

        /* ── Pill labels ── */
        .bp-pill-label {
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          font-weight: 600;
          margin-bottom: 7px;
          font-family: 'Syne', sans-serif;
        }

        /* ── Summary box ── */
        .bp-summary-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-left: 3px solid var(--red);
          border-radius: 10px;
          padding: 18px 22px;
          margin-bottom: 32px;
        }

        /* ── Tip box ── */
        .bp-tip-box {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 18px 22px;
          margin-bottom: 32px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .bp-tip-icon {
          width: 34px;
          height: 34px;
          background: var(--red-dim);
          border: 1px solid var(--red-border);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ── Trajectory ── */
        .bp-traj-step {
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12.5px;
        }
        .bp-traj-first {
          background: var(--red-dim);
          border: 1px solid var(--red-border);
          color: #ff8385;
        }
        .bp-traj-rest {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          color: var(--text-dim);
        }
        .bp-traj-arrow { color: var(--border2); margin: 0 5px; font-size: 13px; }

        /* ── Profile badge ── */
        .bp-badge {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          background: var(--card2);
          border: 1px solid var(--border2);
          color: var(--text-muted);
        }

        /* ── Intro features ── */
        .bp-features {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 24px;
        }
        .bp-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-dim);
        }
        .bp-feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
          flex-shrink: 0;
        }

        /* ── Divider ── */
        .bp-divider {
          height: 1px;
          background: var(--border);
          margin: 20px 0;
        }

        /* ── Toast ── */
        .bp-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--card2);
          border: 1px solid var(--red-border);
          color: #ff8385;
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 13.5px;
          z-index: 999;
          animation: bpFadeIn 0.3s ease;
          pointer-events: none;
          white-space: nowrap;
        }

        /* ── Animations ── */
        .bp-fade { animation: bpFadeIn 0.38s ease; }
        @keyframes bpFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .bp-pulse { animation: bpPulse 1.5s ease-in-out infinite; }
        @keyframes bpPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* ── Count ── */
        .bp-count { font-size: 12px; color: var(--text-dim); margin-bottom: 8px; }

        /* ── Print ── */
        @media print {
          .bp-no-print { display: none !important; }
          .bp-wrap { background: #fff !important; color: #111 !important; }
          .bp-role-card { border: 1px solid #ddd !important; background: #fff !important; break-inside: avoid; }
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .bp-header { padding: 14px 18px; }
          .bp-content { padding: 36px 18px 80px; }
        }
      `}</style>

      <div className="bp-wrap">
        {toast && <div className="bp-toast">{toast}</div>}

        {/* Header */}
        <div className="bp-header bp-no-print">
          <div className="bp-logo">
            <div className="bp-logo-mark">b</div>
            <div>
              <div className="bp-logo-text">Black Pharma</div>
              <div className="bp-logo-sub">CAREER NAVIGATOR</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {step === 5 && results && (
              <>
                <button className="bp-btn-action" onClick={handleCopy}>
                  {copied ? "✓ Copied" : "⎘ Copy results"}
                </button>
                <button className="bp-btn-action" onClick={() => window.print()}>
                  🖨 Save PDF
                </button>
              </>
            )}
            {step > 0 && (
              <button className="bp-btn-ghost" onClick={reset} style={{ fontSize: 13, padding: "9px 16px" }}>
                Start over
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {step > 0 && step < 5 && (
          <div className="bp-progress bp-no-print">
            <div className="bp-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        )}

        <div className="bp-content">

          {/* ── Step 0: Intro ── */}
          {step === 0 && (
            <div className="bp-fade" style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
              <div style={{
                width: 64, height: 64, background: "var(--red)", borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, margin: "0 auto 28px", fontFamily: "Syne, sans-serif",
                fontWeight: 800, color: "white", fontStyle: "italic",
              }}>b</div>

              <h1 className="bp-h1">
                Your STEM degree.<br />
                <span className="bp-red">Your career path.</span>
              </h1>
              <p className="bp-body" style={{ margin: "0 auto 36px" }}>
                Tell us your background and we'll show the roles you're best suited for —
                with real career trajectories, salaries, certifications, and employers.
              </p>
              <button className="bp-btn-primary" onClick={() => setStep(1)}>
                Find my career path →
              </button>
              <div className="bp-features" style={{ justifyContent: "center" }}>
                {["Any STEM degree", "Pharma · NHS · Tech · Gov", "2 minutes"].map((f) => (
                  <div key={f} className="bp-feature">
                    <div className="bp-feature-dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Degree ── */}
          {step === 1 && (
            <div className="bp-fade">
              <p className="bp-step-label">STEP 1 OF 4</p>
              <h2 className="bp-h2">What did you study?</h2>
              <p className="bp-body">Select your degree or closest subject area.</p>
              <div style={{ position: "relative", marginBottom: 14 }}>
                <select className="bp-select" value={degree} onChange={(e) => setDegree(e.target.value)}>
                  <option value="">— Select your degree —</option>
                  {DEGREES.map((d) => <option key={d}>{d}</option>)}
                </select>
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", pointerEvents: "none" }}>▾</span>
              </div>
              {degree === "Other STEM" && (
                <div style={{ marginBottom: 18 }}>
                  <input
                    className="bp-input"
                    placeholder="e.g. Sports Science, Geology, Optometry…"
                    value={otherDegree}
                    onChange={(e) => setOtherDegree(e.target.value)}
                  />
                </div>
              )}
              <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                <button className="bp-btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="bp-btn-primary" disabled={!degree || (degree === "Other STEM" && !otherDegree.trim())} onClick={() => setStep(2)}>
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Experience ── */}
          {step === 2 && (
            <div className="bp-fade">
              <p className="bp-step-label">STEP 2 OF 4</p>
              <h2 className="bp-h2">What's your experience?</h2>
              <p className="bp-body">Select all that apply — coursework and voluntary work counts.</p>
              <p className="bp-count">{selectedExperiences.length} selected</p>
              <div style={{ marginBottom: 28 }}>
                {EXPERIENCE_GROUPS.map((group) => (
                  <ExperienceGroup
                    key={group.label}
                    group={group}
                    selected={selectedExperiences}
                    onToggle={(val) => toggle(selectedExperiences, setSelectedExperiences, val)}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bp-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="bp-btn-primary" onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Interests ── */}
          {step === 3 && (
            <div className="bp-fade">
              <p className="bp-step-label">STEP 3 OF 4</p>
              <h2 className="bp-h2">What draws you in?</h2>
              <p className="bp-body">Pick what excites you most about a future career.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 32 }}>
                {INTERESTS.map((int) => (
                  <button
                    key={int}
                    className={`bp-chip ${selectedInterests.includes(int) ? "selected" : ""}`}
                    onClick={() => toggle(selectedInterests, setSelectedInterests, int)}
                  >
                    {int}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bp-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="bp-btn-primary" onClick={() => setStep(4)}>Next →</button>
              </div>
            </div>
          )}

          {/* ── Step 4: Sector ── */}
          {step === 4 && (
            <div className="bp-fade">
              <p className="bp-step-label">STEP 4 OF 4</p>
              <h2 className="bp-h2">Any sector preference?</h2>
              <p className="bp-body">We'll prioritise roles in your chosen area — or explore everything.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 10, marginBottom: 32 }}>
                {SECTORS.map((s) => (
                  <button
                    key={s.id}
                    className={`bp-sector-chip ${selectedSector === s.id ? "selected" : ""}`}
                    onClick={() => setSelectedSector(s.id)}
                  >
                    <span style={{ fontSize: 19 }}>{s.icon}</span>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                  </button>
                ))}
              </div>
              {error && <p style={{ color: "var(--red)", fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bp-btn-ghost" onClick={() => setStep(3)}>← Back</button>
                <button className="bp-btn-primary" disabled={loading} onClick={generateResults}>
                  {loading ? <span className="bp-pulse">Analysing your profile…</span> : "Show my career paths →"}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 5: Results ── */}
          {step === 5 && results && (
            <div className="bp-fade" ref={resultsRef}>
              {/* Profile header */}
              <div style={{ marginBottom: 32 }}>
                <p className="bp-step-label">YOUR RESULTS</p>
                <h2 className="bp-h2">Your best-fit career paths</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, margin: "14px 0 20px" }}>
                  <span className="bp-badge">🎓 {degreeLabel}</span>
                  <span className="bp-badge">
                    {SECTORS.find((s) => s.id === selectedSector)?.icon} {sectorLabel}
                  </span>
                  {selectedExperiences.length > 0 && (
                    <span className="bp-badge">⚡ {selectedExperiences.length} experience{selectedExperiences.length !== 1 ? "s" : ""}</span>
                  )}
                </div>
                <div className="bp-summary-box">
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: 14.5 }}>{results.summary}</p>
                </div>
              </div>

              {/* Role cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
                {results.roles?.map((role, i) => (
                  <div key={i} className="bp-role-card">
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                          {role.title}
                        </h3>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12.5, color: "var(--red)" }}>{role.sector}</span>
                          {role.salary_range && (
                            <span style={{ fontSize: 12, color: "var(--text-dim)" }}>· {role.salary_range}</span>
                          )}
                        </div>
                      </div>
                      <span className={`bp-tag ${role.fit === "High" ? "bp-tag-high" : "bp-tag-medium"}`}>
                        {role.fit === "High" ? "✦ Strong fit" : "◈ Good fit"}
                      </span>
                    </div>

                    <p style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 18 }}>{role.why}</p>

                    {/* Trajectory */}
                    <div style={{ marginBottom: 18 }}>
                      <p className="bp-pill-label">CAREER TRAJECTORY</p>
                      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
                        {role.trajectory?.map((t, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center" }}>
                            <div className={`bp-traj-step ${j === 0 ? "bp-traj-first" : "bp-traj-rest"}`}>{t}</div>
                            {j < role.trajectory.length - 1 && <span className="bp-traj-arrow">→</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bp-divider" />

                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                      {/* Skills */}
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <p className="bp-pill-label">SKILLS TO BUILD</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {role.skills_to_build?.map((s, j) => (
                            <span key={j} className="bp-pill bp-pill-skill">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Certs */}
                      {role.certifications?.filter((c) => c !== "none needed").length > 0 && (
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <p className="bp-pill-label">CERTIFICATIONS</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {role.certifications.filter((c) => c !== "none needed").map((c, j) => (
                              <span key={j} className="bp-pill bp-pill-cert">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Employers */}
                      <div style={{ flex: 1, minWidth: 150 }}>
                        <p className="bp-pill-label">EXAMPLE EMPLOYERS</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {role.example_employers?.map((e, j) => (
                            <span key={j} className="bp-pill bp-pill-employer">{e}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top tip */}
              {results.top_tip && (
                <div className="bp-tip-box">
                  <div className="bp-tip-icon">💡</div>
                  <div>
                    <p className="bp-pill-label" style={{ marginBottom: 6 }}>YOUR STANDOUT TIP</p>
                    <p style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: 14.5 }}>{results.top_tip}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bp-no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button className="bp-btn-action" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "⎘ Copy results"}
                </button>
                <button className="bp-btn-action" onClick={() => window.print()}>🖨 Save as PDF</button>
                <button className="bp-btn-primary" onClick={reset}>
                  Try a different profile →
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
