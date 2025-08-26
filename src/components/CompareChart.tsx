'use client'

import { NEO } from '@/types/neo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface CompareChartProps {
  neos: NEO[]
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    payload: {
      fullName: string
      diameter: number
      distance: number
      velocity: number
    }
    dataKey: string
    color: string
    value: number
  }>
}

export default function CompareChart({ neos }: CompareChartProps) {
  const barChartData = neos.map(neo => {
    const avgDiameter = (
      neo.estimated_diameter.kilometers.estimated_diameter_min + 
      neo.estimated_diameter.kilometers.estimated_diameter_max
    ) / 2

    const distance = parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers || '0')
    const velocity = parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0')

    return {
      name: neo.name.replace(/[()]/g, '').substring(0, 15) + '...',
      fullName: neo.name,
      diameter: parseFloat(avgDiameter.toFixed(3)),
      distance: Math.round(distance / 1000),
      velocity: Math.round(velocity),
      hazardous: neo.is_potentially_hazardous_asteroid ? 1 : 0
    }
  })

  const pieChartData = [
    {
      name: 'Potentially Hazardous',
      value: neos.filter(neo => neo.is_potentially_hazardous_asteroid).length,
      color: '#ef4444'
    },
    {
      name: 'Non-Hazardous',
      value: neos.filter(neo => !neo.is_potentially_hazardous_asteroid).length,
      color: '#22c55e'
    }
  ]

  const CustomTooltip = ({ active, payload }: ChartTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'diameter' && `Diameter: ${entry.value} km`}
              {entry.dataKey === 'distance' && `Distance: ${entry.value}k km`}
              {entry.dataKey === 'velocity' && `Velocity: ${entry.value} km/h`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📏 Diameter Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="diameter" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {pieChartData[0].value > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚠️ Hazard Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
