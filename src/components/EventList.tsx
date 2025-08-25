'use client'

import { useState, useMemo } from 'react'
import { NEO } from '@/types/neo'
import EventCard from './EventCard'
import FilterControls, { FilterState } from './FilterControls'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EventListProps {
  neos: NEO[]
  loading?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export default function EventList({ neos, loading, onLoadMore, hasMore }: EventListProps) {
  const router = useRouter()
  const [selectedNEOs, setSelectedNEOs] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<FilterState>({
    showHazardousOnly: false,
    sortBy: 'date',
    sortOrder: 'asc'
  })

  // Apply filters and sorting
  const filteredAndSortedNEOs = useMemo(() => {
    let filtered = [...neos]
    
    // Apply hazardous filter
    if (filters.showHazardousOnly) {
      filtered = filtered.filter(neo => neo.is_potentially_hazardous_asteroid)
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'date':
          const dateA = new Date(a.close_approach_data[0]?.close_approach_date || '').getTime()
          const dateB = new Date(b.close_approach_data[0]?.close_approach_date || '').getTime()
          comparison = dateA - dateB
          break
        case 'size':
          const avgA = (a.estimated_diameter.kilometers.estimated_diameter_min + 
                       a.estimated_diameter.kilometers.estimated_diameter_max) / 2
          const avgB = (b.estimated_diameter.kilometers.estimated_diameter_min + 
                       b.estimated_diameter.kilometers.estimated_diameter_max) / 2
          comparison = avgA - avgB
          break
        case 'distance':
          const distA = parseFloat(a.close_approach_data[0]?.miss_distance.kilometers || '0')
          const distB = parseFloat(b.close_approach_data[0]?.miss_distance.kilometers || '0')
          comparison = distA - distB
          break
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })
    
    return filtered
  }, [neos, filters])

  const handleToggleSelect = (neoId: string) => {
    const newSelected = new Set(selectedNEOs)
    if (newSelected.has(neoId)) {
      newSelected.delete(neoId)
    } else {
      newSelected.add(neoId)
    }
    setSelectedNEOs(newSelected)
  }

  const handleCompare = () => {
    if (selectedNEOs.size > 0) {
      const selectedIds = Array.from(selectedNEOs).join(',')
      router.push(`/compare?ids=${selectedIds}`)
    }
  }

  const clearSelection = () => {
    setSelectedNEOs(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Header with Compare Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Near-Earth Objects</h2>
          <p className="text-gray-600 mt-1">
            Tracking cosmic events in our neighborhood
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedNEOs.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedNEOs.size} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          )}
          
          <Button 
            onClick={handleCompare}
            disabled={selectedNEOs.size === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare ({selectedNEOs.size})
          </Button>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterControls 
            onFilterChange={setFilters}
            totalCount={neos.length}
            filteredCount={filteredAndSortedNEOs.length}
          />
        </div>
        
        {/* NEO Cards Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAndSortedNEOs.map(neo => (
              <EventCard 
                key={neo.id}
                neo={neo}
                isSelected={selectedNEOs.has(neo.id)}
                onToggleSelect={handleToggleSelect}
                showCheckbox={true}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button 
                onClick={onLoadMore} 
                disabled={loading}
                variant="outline"
                size="lg"
              >
                {loading ? (
                  <>Loading more...</>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Load More NEOs
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
