'use client'

import { useState, useEffect, useCallback } from 'react'
import { NEOFeedResponse, NEO } from '@/types/neo'

interface UseNEODataReturn {
  neoData: NEO[]
  loading: boolean
  error: string | null
  loadMore: () => void
  hasMore: boolean
  refetch: () => void
  dateRange: {
    start: string
    end: string
  }
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getDateRange = (startDate: Date, days: number) => {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + days - 1)
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  }
}

export const useNEOData = (initialDays = 7): UseNEODataReturn => {
  const [neoData, setNeoData] = useState<NEO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStartDate, setCurrentStartDate] = useState(new Date())
  const [hasMore, setHasMore] = useState(true)

  const fetchNEOData = useCallback(async (startDate: Date, days: number, append = false) => {
    setLoading(true)
    setError(null)
    
    try {
      const { start, end } = getDateRange(startDate, days)
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY'
      
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`)
      }
      
      const data: NEOFeedResponse = await response.json()
      
      // Flatten the near_earth_objects object into an array
      const neos: NEO[] = []
      Object.values(data.near_earth_objects).forEach(dayNeos => {
        neos.push(...dayNeos)
      })
      
      // Sort by closest approach date
      neos.sort((a, b) => {
        const dateA = new Date(a.close_approach_data[0]?.close_approach_date || '').getTime()
        const dateB = new Date(b.close_approach_data[0]?.close_approach_date || '').getTime()
        return dateA - dateB
      })
      
      if (append) {
        setNeoData(prev => [...prev, ...neos])
      } else {
        setNeoData(neos)
      }
      
      // Check if we can load more (arbitrary limit to prevent infinite loading)
      const maxFutureDate = new Date()
      maxFutureDate.setDate(maxFutureDate.getDate() + 30)
      setHasMore(new Date(end) < maxFutureDate)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NEO data'
      setError(errorMessage)
      console.error('NEO Data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    
    const nextStartDate = new Date(currentStartDate)
    nextStartDate.setDate(nextStartDate.getDate() + initialDays)
    setCurrentStartDate(nextStartDate)
    
    fetchNEOData(nextStartDate, initialDays, true)
  }, [loading, hasMore, currentStartDate, initialDays, fetchNEOData])

  const refetch = useCallback(() => {
    const today = new Date()
    setCurrentStartDate(today)
    setHasMore(true)
    fetchNEOData(today, initialDays, false)
  }, [initialDays, fetchNEOData])

  // Initial load
  useEffect(() => {
    fetchNEOData(currentStartDate, initialDays, false)
  }, [currentStartDate, fetchNEOData, initialDays]) // Include all dependencies

  return {
    neoData,
    loading,
    error,
    loadMore,
    hasMore,
    refetch,
    dateRange: getDateRange(currentStartDate, initialDays)
  }
}
