export const modules = [
  {
    id: 1,
    slug: 'module-1',
    title: 'Discover Yourself',
    subtitle: 'Know Your Strengths',
    free: true,
    lessons: [
      {
        id: 'l1-1',
        title: 'Personality & Strengths Reflection',
        duration: '8 min',
        content: `Before you can break into pharma, you need to understand what you bring to the table.

**Reflection questions:**
- What do colleagues consistently praise you for?
- What tasks make you lose track of time?
- When have you solved a problem others found difficult?
- Do you prefer structure or flexibility? Working alone or in teams?

These aren't throwaway questions. Your answers will directly shape which pharma functions you target and how you position yourself in applications and interviews.`,
        worksheet: {
          title: 'My Top 5 Strengths',
          prompt: 'List your top 5 strengths. Think beyond technical skills — include personality traits, soft skills and life experience.',
          lines: 5,
        }
      },
      {
        id: 'l1-2',
        title: 'Transferable Skills Audit',
        duration: '10 min',
        content: `Every experience — even outside pharma — builds transferable skills. Most people dramatically underestimate what they already bring.

**Common transferable skills that pharma values:**
- Data analysis → Clinical data, HEOR, R&D
- Project management → Clinical Ops, Regulatory
- Communication → Medical Affairs, Commercial
- Problem solving → R&D, Quality, PV
- Stakeholder management → Market Access, Medical Affairs

The key is translating your experience into pharma language.`,
        worksheet: {
          title: 'My Transferable Skills',
          prompt: 'For each skill you have, write where you used it and how it applies to pharma.',
          lines: 6,
        }
      },
      {
        id: 'l1-3',
        title: 'Science vs Business Pathways',
        duration: '6 min',
        content: `Pharma needs both scientific and commercial thinkers. Neither is better — both are essential.

**Science-leaning roles:** R&D, Regulatory Affairs, Pharmacovigilance, Quality Assurance, Clinical Operations

**Business-leaning roles:** Commercial/Sales, Market Access, HEOR, Medical Affairs, Marketing

**Don't have a science degree? That's OK.**
Roles in Commercial, Market Access, HEOR, Medical Affairs and Data & Analytics welcome graduates from business, economics, social science, maths, computing and the arts. What matters is your transferable skills and your drive.`,
        worksheet: {
          title: 'My Pathway',
          prompt: 'Which pathway excites you more and why? It\'s okay to sit in the middle — many roles blend both worlds.',
          lines: 4,
        }
      },
      {
        id: 'l1-4',
        title: 'Interests Mapping',
        duration: '7 min',
        content: `Knowing what excites you makes your applications far more compelling — and helps you stay motivated through a long job search.

**Questions to guide your interests map:**
- Which diseases or therapy areas interest you most? (oncology, neurology, rare disease, infectious disease...)
- Are you drawn to patient impact, scientific innovation, policy or business?
- Global or local focus?
- Startup culture or large multinational?

Black Pharma's community spans professionals across all of these areas — and we've seen people thrive in every single one.`,
        worksheet: {
          title: 'My Pharma Interests Map',
          prompt: 'List your therapy areas of interest, preferred company types, and what meaningful work means to you.',
          lines: 5,
        }
      },
    ]
  },
  {
    id: 2,
    slug: 'module-2',
    title: 'Explore Pharma Careers',
    subtitle: 'Find Where You Fit',
    free: false,
    lessons: [
      { id: 'l2-1', title: 'Clinical Operations', duration: '8 min', content: '', worksheet: null },
      { id: 'l2-2', title: 'Medical Affairs', duration: '8 min', content: '', worksheet: null },
      { id: 'l2-3', title: 'Regulatory Affairs', duration: '7 min', content: '', worksheet: null },
      { id: 'l2-4', title: 'Pharmacovigilance', duration: '7 min', content: '', worksheet: null },
      { id: 'l2-5', title: 'Market Access & HEOR', duration: '8 min', content: '', worksheet: null },
      { id: 'l2-6', title: 'Commercial & Sales', duration: '7 min', content: '', worksheet: null },
      { id: 'l2-7', title: 'Quality Assurance', duration: '6 min', content: '', worksheet: null },
      { id: 'l2-8', title: 'R&D', duration: '8 min', content: '', worksheet: null },
      { id: 'l2-9', title: 'Data & Analytics', duration: '7 min', content: '', worksheet: null },
    ]
  },
  {
    id: 3,
    slug: 'module-3',
    title: 'Build Your Brand',
    subtitle: 'Position Yourself',
    free: false,
    lessons: [
      { id: 'l3-1', title: 'CV Tailoring', duration: '10 min', content: '', worksheet: null },
      { id: 'l3-2', title: 'LinkedIn Optimisation', duration: '8 min', content: '', worksheet: null },
      { id: 'l3-3', title: 'STAR Examples Bank', duration: '12 min', content: '', worksheet: null },
      { id: 'l3-4', title: 'Interview Question Bank', duration: '10 min', content: '', worksheet: null },
      { id: 'l3-5', title: 'Networking Scripts', duration: '8 min', content: '', worksheet: null },
      { id: 'l3-6', title: 'Pharma Glossary', duration: '6 min', content: '', worksheet: null },
    ]
  },
  {
    id: 4,
    slug: 'module-4',
    title: 'Take Action',
    subtitle: 'Break Into Pharma',
    free: false,
    lessons: [
      { id: 'l4-1', title: 'Your 30-Day Sprint', duration: '8 min', content: '', worksheet: null },
      { id: 'l4-2', title: '90-Day Roadmap', duration: '10 min', content: '', worksheet: null },
      { id: 'l4-3', title: 'Networking Plan', duration: '7 min', content: '', worksheet: null },
      { id: 'l4-4', title: 'Mentorship Programme', duration: '6 min', content: '', worksheet: null },
      { id: 'l4-5', title: 'Application Tracker', duration: '8 min', content: '', worksheet: null },
    ]
  }
]
