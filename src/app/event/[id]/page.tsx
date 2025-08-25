'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { NEO } from '@/types/neo'
import { useGlobalNEOData } from '@/hooks/useGlobalNEOData'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Calendar, Ruler, Zap, Target, Globe } from 'lucide-react'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getNEOById, loading } = useGlobalNEOData()
  const [neo, setNeo] = useState<NEO | null>(null)

  useEffect(() => {
    if (params.id) {
      const found = getNEOById(params.id as string)
      setNeo(found || null)
    }
  }, [params.id, getNEOById])

  if (loading && !neo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!neo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle>NEO Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              The requested Near-Earth Object could not be found.
            </p>
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rest of your existing detail page JSX stays the same...
  const avgDiameter = (
    (neo.estimated_diameter.kilometers.estimated_diameter_min + 
     neo.estimated_diameter.kilometers.estimated_diameter_max) / 2
  ).toFixed(3)

  const closeApproach = neo.close_approach_data[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Keep all your existing JSX from the detail page */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{neo.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                {neo.is_potentially_hazardous_asteroid && (
                  <Badge variant="destructive">
                    ⚠️ Potentially Hazardous
                  </Badge>
                )}
                <Badge variant="outline">
                  ID: {neo.neo_reference_id}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">{neo.name}</h2>
          <p className="text-gray-600 mt-2">
            Diameter: {avgDiameter} km | 
            Approach: {new Date(closeApproach?.close_approach_date || '').toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
