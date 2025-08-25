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
        <footer className="bg-black text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 flex gap-4 justify-center">
              <span>Crafted by <span className="font-semibold text-white hover:underline-offset-3 hover:underline"><a href="https://arcbit.vercel.app/">Kartik Tyagi</a></span></span> 
              |
              <span>
                <a href="https://github.com/kartiktyagi2001/"><img src="/github.svg" width={24} height={24} alt="GitHub" /></a>
              </span><span > <a href="mailto:arcbit.kartik@proton.me"><img src="/email.svg" width={24} height={24} alt="Email" /></a> </span>

            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
