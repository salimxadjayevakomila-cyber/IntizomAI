 import type { Metadata } from 'next'
import { LanguageProvider } from '@/contexts/language-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Intizom AI',
  description: 'AI Fitness Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}