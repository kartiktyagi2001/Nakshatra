// 'use client'

// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import { signout } from '@/app/login/actions'
// import { useRouter } from 'next/navigation'
// import { useState, useEffect } from 'react'

// interface HeaderProps {
//   user?: any
// }

// export default function Header({ user }: HeaderProps) {
//   const router = useRouter()
  
//   const handleSignOut = async () => {
//     await signout()
//   }

//   return (
//     <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-40">
//       <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <span className="text-2xl">🌌</span>
//           <h1 className="text-xl font-bold text-gray-900">
//             Cosmic Event Tracker
//           </h1>
//         </div>
        
//         <nav className="flex items-center space-x-4">
//           <Button 
//             variant="ghost" 
//             onClick={() => router.push('/')}
//           >
//             Home
//           </Button>
          
//           {user && (
//             <>
//               <span className="text-sm text-gray-600">
//                 Welcome, {user.email}
//               </span>
//               <Button 
//                 variant="outline" 
//                 size="sm"
//                 onClick={handleSignOut}
//               >
//                 Sign Out
//               </Button>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   )
// }


'use client'

import { Button } from '@/components/ui/button'
import { signout } from '@/app/login/actions'
import { useRouter } from 'next/navigation'

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
            Cosmic Event Tracker
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
            </>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
