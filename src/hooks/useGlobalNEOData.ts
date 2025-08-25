'use client'

import { useState, useEffect, useCallback } from 'react'
import { NEOFeedResponse, NEO } from '@/types/neo'

// Global state outside component to persist across pages
let globalNEOData: NEO[] = []
let globalLoading = false
let globalError: string | null = null

interface UseGlobalNEODataReturn {
  neoData: NEO[]
  loading: boolean
  error: string | null
  loadMore: () => void
  hasMore: boolean
  refetch: () => void
  getNEOById: (id: string) => NEO | undefined
  getNEOsByIds: (ids: string[]) => NEO[]
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const useGlobalNEOData = (): UseGlobalNEODataReturn => {
  const [neoData, setNeoData] = useState<NEO[]>(globalNEOData)
  const [loading, setLoading] = useState(globalLoading)
  const [error, setError] = useState<string | null>(globalError)
  const [hasMore, setHasMore] = useState(true)

  const fetchNEOData = useCallback(async (append = false) => {
    // Don't fetch if we already have data and not appending
    if (globalNEOData.length > 0 && !append) {
      setNeoData(globalNEOData)
      setLoading(false)
      return
    }

    globalLoading = true
    setLoading(true)
    globalError = null
    setError(null)
    
    try {
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(today.getDate() + (append ? 14 : 7)) // Load 7 or 14 days
      
      const start = formatDate(today)
      const end = formatDate(endDate)
      const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY
      
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status}`)
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
        globalNEOData = [...globalNEOData, ...neos]
      } else {
        globalNEOData = neos
      }
      
      setNeoData(globalNEOData)
      setHasMore(true)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch NEO data'
      globalError = errorMessage
      setError(errorMessage)
      console.error('NEO Data fetch error:', err)
    } finally {
      globalLoading = false
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    fetchNEOData(true)
  }, [loading, hasMore, fetchNEOData])

  const refetch = useCallback(() => {
    globalNEOData = [] // Clear global data
    fetchNEOData(false)
  }, [fetchNEOData])

  const getNEOById = useCallback((id: string): NEO | undefined => {
    return globalNEOData.find(neo => neo.id === id)
  }, [])

  const getNEOsByIds = useCallback((ids: string[]): NEO[] => {
    return globalNEOData.filter(neo => ids.includes(neo.id))
  }, [])

  // Initial load only if no data exists
  useEffect(() => {
    if (globalNEOData.length === 0 && !globalLoading) {
      fetchNEOData(false)
    } else {
      setNeoData(globalNEOData)
      setLoading(globalLoading)
      setError(globalError)
    }
  }, [fetchNEOData])

  return {
    neoData,
    loading,
    error,
    loadMore,
    hasMore,
    refetch,
    getNEOById,
    getNEOsByIds
  }
}
