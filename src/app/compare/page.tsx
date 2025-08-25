'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { NEO } from '@/types/neo'
import { useGlobalNEOData } from '@/hooks/useGlobalNEOData'
import CompareChart from '@/components/CompareChart'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ComparePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getNEOsByIds, loading } = useGlobalNEOData()
  const [selectedNEOs, setSelectedNEOs] = useState<NEO[]>([])

  useEffect(() => {
    const idsParam = searchParams.get('ids')
    if (idsParam) {
      const ids = idsParam.split(',')
      const selected = getNEOsByIds(ids)
      setSelectedNEOs(selected)
    }
  }, [searchParams, getNEOsByIds])

  const handleBack = () => {
    router.push('/')
  }

  if (loading && selectedNEOs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (selectedNEOs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle>No NEOs Selected</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Please select some Near-Earth Objects to compare.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  NEO Comparison
                </h1>
                <p className="text-gray-600">
                  Comparing {selectedNEOs.length} Near-Earth Objects
                </p>
              </div>
            </div>
          </div>
          
          {/* Selected NEOs Summary */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedNEOs.map(neo => (
              <div
                key={neo.id}
                className={`px-3 py-1 rounded-full text-sm border ${
                  neo.is_potentially_hazardous_asteroid
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}
              >
                {neo.name}
                {neo.is_potentially_hazardous_asteroid && ' ⚠️'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="container mx-auto px-4 py-8">
        <CompareChart neos={selectedNEOs} />
      </div>
    </div>
  )
}
