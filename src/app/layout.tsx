import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nakshatra CET',
  description: 'Track Near-Earth Objects and cosmic events using NASA APIs',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={inter.className}>
        <Header user={user} />
        <main>{children}</main>
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              Crafted by <span className="font-semibold text-white">Kartik Tyagi</span> | 
              Powered by NASA APIs & Next.js
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
