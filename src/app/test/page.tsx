'use client'

import { useGlobalNEOData } from '@/hooks/useGlobalNEOData'
import EventList from '@/components/EventList'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function TestPage() {
  const { neoData, loading, error, loadMore, hasMore } = useGlobalNEOData()
  
  if (loading && neoData.length === 0) return <LoadingSpinner />
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>
  
  return (
    <div className="container mx-auto px-4 py-8">
      <EventList 
        neos={neoData}
        loading={loading}
        onLoadMore={loadMore}
        hasMore={hasMore}
      />
    </div>
  )
}
