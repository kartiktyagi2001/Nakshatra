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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface CompareChartProps {
  neos: NEO[]
}

export default function CompareChart({ neos }: CompareChartProps) {
  // Prepare data for different charts
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
      distance: Math.round(distance / 1000), // Convert to thousands of km
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.fullName}</p>
          {payload.map((entry: any, index: number) => (
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
      {/* Size Comparison */}
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
              <YAxis label={{ value: 'Diameter (km)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="diameter" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distance vs Velocity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🚀 Distance vs Velocity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                label={{ value: 'Distance (1000s km)', angle: -90, position: 'insideLeft' }} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                label={{ value: 'Velocity (km/h)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="distance" fill="#10b981" name="Distance (1000s km)" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="velocity" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Velocity (km/h)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hazard Status */}
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
                  label={({ name, value, percent }) => `${name}: ${value} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
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

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Diameter (km)</th>
                  <th className="text-left p-2">Distance (km)</th>
                  <th className="text-left p-2">Velocity (km/h)</th>
                  <th className="text-left p-2">Hazardous</th>
                  <th className="text-left p-2">Approach Date</th>
                </tr>
              </thead>
              <tbody>
                {neos.map(neo => {
                  const avgDiameter = (
                    neo.estimated_diameter.kilometers.estimated_diameter_min + 
                    neo.estimated_diameter.kilometers.estimated_diameter_max
                  ) / 2
                  const distance = parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers || '0')
                  const velocity = parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0')
                  
                  return (
                    <tr key={neo.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{neo.name}</td>
                      <td className="p-2">{avgDiameter.toFixed(3)}</td>
                      <td className="p-2">{distance.toLocaleString()}</td>
                      <td className="p-2">{velocity.toLocaleString()}</td>
                      <td className="p-2">
                        {neo.is_potentially_hazardous_asteroid ? (
                          <span className="text-red-600 font-medium">⚠️ Yes</span>
                        ) : (
                          <span className="text-green-600">✅ No</span>
                        )}
                      </td>
                      <td className="p-2">
                        {new Date(neo.close_approach_data[0]?.close_approach_date || '').toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
