'use client'

import { NEO } from '@/types/neo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CalendarDays, Ruler, Zap, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"


interface EventCardProps {
  neo: NEO
  isSelected?: boolean
  onToggleSelect?: (neoId: string) => void
  showCheckbox?: boolean
}

export default function EventCard({ 
  neo, 
  isSelected = false, 
  onToggleSelect, 
  showCheckbox = false 
}: EventCardProps) {
  const router = useRouter()
  
  // Calculate average diameter
  const avgDiameter = (
    (neo.estimated_diameter.kilometers.estimated_diameter_min + 
     neo.estimated_diameter.kilometers.estimated_diameter_max) / 2
  ).toFixed(3)
  
  // Get closest approach data
  const closeApproach = neo.close_approach_data[0]
  const approachDate = new Date(closeApproach?.close_approach_date).toLocaleDateString()
  const velocity = closeApproach?.relative_velocity.kilometers_per_hour
  const distance = parseFloat(closeApproach?.miss_distance.kilometers || '0').toLocaleString()

  const handleCardClick = () => {
    router.push(`/event/${neo.id}`)
  }

  const handleCheckboxChange = () => {
    if (onToggleSelect) {
      onToggleSelect(neo.id)
    }
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg cursor-pointer",
      isSelected && "ring-2 ring-blue-500 bg-blue-50/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate pr-2">
              {neo.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {neo.is_potentially_hazardous_asteroid && (
                <Badge variant="destructive" className="text-xs">
                  ⚠️ Potentially Hazardous
                </Badge>
              )}
              {neo.is_sentry_object && (
                <Badge variant="secondary" className="text-xs">
                  🎯 Sentry Object
                </Badge>
              )}
            </div>
          </div>
          
          {showCheckbox && (
            <Checkbox 
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 border-gray-500"
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={handleCardClick}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4" />
            <span>Closest Approach: {approachDate}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Ruler className="h-4 w-4" />
            <span>Avg Diameter: {avgDiameter} km</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Zap className="h-4 w-4" />
            <span>Velocity: {parseFloat(velocity).toLocaleString()} km/h</span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-gray-500">
              Distance: {distance} km
            </span>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
