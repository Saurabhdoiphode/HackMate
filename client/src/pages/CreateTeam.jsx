import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function CreateTeam(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectIdea: '',
    techStack: '',
    lookingFor: '',
    maxMembers: 5
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login first')
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:4000/team/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      alert('Team created successfully! 🎉')
      navigate(`/team/${response.data.team._id}`)
    } catch (err) {
      console.error('Team creation failed:', err)
      alert(err.response?.data?.message || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value}))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to login to create a team.</p>
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Dream Team 🚀</h1>
          <p className="text-xl text-gray-200">Build something amazing together. Define your vision and attract the right talent.</p>
        </div>

        <div className="card p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., EcoTracker Squad"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Members</label>
                <select
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value={2}>2 members</option>
                  <option value={3}>3 members</option>
                  <option value={4}>4 members</option>
                  <option value={5}>5 members</option>
                  <option value={6}>6 members</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your team's mission, goals, and what makes it special..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Idea</label>
              <textarea
                name="projectIdea"
                value={formData.projectIdea}
                onChange={handleChange}
                placeholder="Share your project concept, problem you're solving, or innovation you're building..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                <input
                  type="text"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, Python, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
                <input
                  type="text"
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleChange}
                  placeholder="Frontend Dev, Designer, ML Engineer, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary text-white py-3 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
              >
                {loading ? '🔄 Creating...' : '🚀 Create Team'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/find')}
                className="px-8 py-3 border border-gray-300 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
              >
                Browse Teams Instead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
