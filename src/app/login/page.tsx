import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 via-purple-900 to-black">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      <Card className="w-full max-w-md mx-4 relative z-10">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">🌌</div>
          <CardTitle className="text-2xl font-bold">Cosmic Event Tracker</CardTitle>
          <CardDescription>Sign in to track Near-Earth Objects</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="astronaut@cosmos.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Button formAction={login} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                🚀 Sign In
              </Button>
              <Button formAction={signup} variant="outline" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
          {searchParams?.message && (
            <div className={`mt-4 p-4 rounded-md text-sm ${
              searchParams.message.includes('Check email') 
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {searchParams.message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
