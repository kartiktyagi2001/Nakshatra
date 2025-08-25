'use client'

import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'
import { redirect, useRouter } from 'next/navigation'

interface HeaderProps {
  user?: any
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter()
  
  const handleSignOut = async () => {
    await signout()
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-2xl">🌌</span>
          <h1 className="text-xl font-bold text-gray-900">
            Nakshatra
          </h1>
        </div>
        
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.email?.split('@')[0]}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>

              {/* <span className='w-6 h-6 hover:w-8 hover:h-8 transition-all '><a href="https://github.com/kartiktyagi2001/Nakshatra"><img src="/github.svg" alt="" /></a></span> */}
            </>
          ) : (
            <div className='flex gap-4'>
              <Button 
                variant="outline" 
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>

              {/* <Button className='bg-purple-400 hover:bg-gray-400'
                variant="outline" 
                onClick={() => redirect('https://github.com/kartiktyagi2001/Nakshatra')}
              >
                Source Code?
              </Button> */}
            </div>
            
          )}
        </nav>
      </div>
    </header>
  )
}
