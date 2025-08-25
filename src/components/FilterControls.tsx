'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, RotateCcw } from 'lucide-react'

interface FilterControlsProps {
  onFilterChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export interface FilterState {
  showHazardousOnly: boolean
  sortBy: 'date' | 'size' | 'distance'
  sortOrder: 'asc' | 'desc'
}

const defaultFilters: FilterState = {
  showHazardousOnly: false,
  sortBy: 'date',
  sortOrder: 'asc'
}

export default function FilterControls({ 
  onFilterChange, 
  totalCount, 
  filteredCount 
}: FilterControlsProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  
  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }
  
  const resetFilters = () => {
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters & Sorting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hazardous"
            checked={filters.showHazardousOnly}
            onCheckedChange={(checked) => 
              handleFilterUpdate({ showHazardousOnly: checked as boolean })
            }
          />
          <Label htmlFor="hazardous" className="text-sm">
            Show only potentially hazardous asteroids
          </Label>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort by</Label>
          <Select 
            value={filters.sortBy} 
            onValueChange={(value: 'date' | 'size' | 'distance') => 
              handleFilterUpdate({ sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Approach Date</SelectItem>
              <SelectItem value="size">Diameter</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Order</Label>
          <Select 
            value={filters.sortOrder}
            onValueChange={(value: 'asc' | 'desc') => 
              handleFilterUpdate({ sortOrder: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-gray-600">
            Showing {filteredCount} of {totalCount} NEOs
          </span>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
