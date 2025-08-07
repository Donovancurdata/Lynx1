import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LYNX - Ledger Yield & Node eXplorer',
  description: 'AI-powered blockchain analytics platform for wallet analysis and fund flow tracking',
  keywords: ['blockchain', 'analytics', 'wallet', 'tracking', 'forex', 'ethereum', 'bitcoin'],
  authors: [{ name: 'Donovan' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
          {children}
        </div>
      </body>
    </html>
  )
} 