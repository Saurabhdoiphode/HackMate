import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminDashboard(){
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('http://localhost:4000/admin/metrics')
      setMetrics(res.data)
    } catch (err) {
      console.error('Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      
      {metrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.stats.totalTeams}</div>
              <div className="text-sm text-gray-600">Total Teams</div>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-purple-600">{Math.round(metrics.stats.avgXP)}</div>
              <div className="text-sm text-gray-600">Average XP</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
              <div className="space-y-2">
                {metrics.recentUsers.map(user => (
                  <div key={user._id} className="flex justify-between text-sm">
                    <span>{user.name}</span>
                    <span className="text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Recent Teams</h3>
              <div className="space-y-2">
                {metrics.topTeams.map(team => (
                  <div key={team._id} className="flex justify-between text-sm">
                    <span>{team.name}</span>
                    <span className="text-gray-500">{team.owner?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}