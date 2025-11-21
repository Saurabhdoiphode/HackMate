import React, { useState } from 'react'
import axios from 'axios'

export default function FindTeammates(){
  const [skills, setSkills] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  
  const search = async () => {
    setLoading(true)
    const arr = skills.split(',').map(s=>s.trim()).filter(Boolean)
    try {
      const res = await axios.post('http://localhost:4000/matchmaking/search', {skills:arr})
      setResults(res.data.results)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Your Dream Team 🚀</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Connect with talented developers who complement your skills and share your passion for building amazing projects.</p>
        </div>

        {/* Search Section */}
        <div className="card p-8 rounded-2xl mb-8">
          <h3 className="text-2xl font-bold gradient-text mb-6">Search by Skills</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="Enter skills (e.g. React, Node.js, Python, Design)"
              className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
            />
            <button
              onClick={search}
              disabled={loading}
              className="btn-primary text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
            >
              {loading ? '🔄 Searching...' : '🔍 Find Matches'}
            </button>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-sm text-gray-600">Popular skills:</span>
            {['React', 'Node.js', 'Python', 'Design', 'ML', 'Blockchain'].map(skill => (
              <button
                key={skill}
                onClick={() => setSkills(prev => prev ? `${prev}, ${skill}` : skill)}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Found {results.length} matches 🎯</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(r => (
                <div key={r.user._id} className="card p-6 rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">{r.user.name?.[0] || 'U'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{r.user.name}</h4>
                      <p className="text-sm text-gray-600">{r.user.expertise} Developer</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Compatibility</span>
                      <span className="text-sm font-bold text-purple-600">{r.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${r.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {(r.user.skills || []).slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary text-white py-2 rounded-lg font-medium text-sm transition-all">
                      💬 Connect
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      👁️ View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {results.length === 0 && skills && !loading && (
          <div className="card p-12 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold mb-2">No matches found</h3>
            <p className="text-gray-600 mb-6">Try different skills or broaden your search criteria</p>
            <button
              onClick={() => setSkills('')}
              className="text-purple-600 font-semibold hover:text-purple-800 transition-colors"
            >
              Clear search →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
