import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Black Pharma Career Playbook',
  description: 'Your step-by-step guide to breaking into the pharmaceutical industry.',
  openGraph: {
    title: 'Black Pharma Career Playbook',
    description: 'Your step-by-step guide to breaking into the pharmaceutical industry.',
    url: 'https://blackpharma.org',
    siteName: 'Black Pharma',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
