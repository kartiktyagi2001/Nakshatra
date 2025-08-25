'use client'

import { useGlobalNEOData } from '@/hooks/useGlobalNEOData'
import EventList from '@/components/EventList'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react'

interface HomePageProps {
  user: any
}

export default function HomePage({ user }: HomePageProps) {
  const { neoData, loading, error, loadMore, hasMore, refetch } = useGlobalNEOData()
  
  // Calculate statistics
  const hazardousCount = neoData.filter(neo => neo.is_potentially_hazardous_asteroid).length
  const avgDiameter = neoData.length > 0 ? (
    neoData.reduce((sum, neo) => {
      const avg = (neo.estimated_diameter.kilometers.estimated_diameter_min + 
                  neo.estimated_diameter.kilometers.estimated_diameter_max) / 2
      return sum + avg
    }, 0) / neoData.length
  ).toFixed(2) : 0
  
  const closestNEO = neoData.length > 0 ? neoData[0] : null
  
  if (loading && neoData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading cosmic events...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Error Loading Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{error}</p>
              <Button onClick={refetch} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🌌 Cosmic Event Tracker
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Track Near-Earth Objects and cosmic events using real-time NASA data
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                Real-time NASA Data
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                Interactive Charts
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                Hazard Assessment
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{neoData.length}</div>
              <div className="text-gray-600 text-sm">Total NEOs Tracked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600">{hazardousCount}</div>
              <div className="text-gray-600 text-sm">Potentially Hazardous</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{avgDiameter}</div>
              <div className="text-gray-600 text-sm">Avg Diameter (km)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {closestNEO ? new Date(closestNEO.close_approach_data[0]?.close_approach_date).getDate() : 0}
              </div>
              <div className="text-gray-600 text-sm">Next Close Approach</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <EventList 
          neos={neoData}
          loading={loading}
          onLoadMore={loadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  )
}
