import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back! 👋</h1>
          <p className="text-gray-200 text-lg">Ready to build something amazing? Let's find your dream team.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-gray-200 text-sm">Teams Joined</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-gray-200 text-sm">XP Points</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-gray-200 text-sm">Badges Earned</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-white mb-1">0</div>
            <div className="text-gray-200 text-sm">Projects Built</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="card p-8 rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Find Teammates</h3>
            <p className="text-gray-600 mb-6">Discover developers with complementary skills using AI-powered matching.</p>
            <Link to="/find" className="btn-primary text-white px-6 py-3 rounded-xl font-semibold inline-block transition-all">
              Start Searching
            </Link>
          </div>

          <div className="card p-8 rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Create Team</h3>
            <p className="text-gray-600 mb-6">Start your own team and let others discover and join your mission.</p>
            <Link to="/create-team" className="btn-primary text-white px-6 py-3 rounded-xl font-semibold inline-block transition-all">
              Create Team
            </Link>
          </div>

          <div className="card p-8 rounded-2xl hover:transform hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-bold mb-4 gradient-text">Generate Ideas</h3>
            <p className="text-gray-600 mb-6">Get AI-powered project ideas with tech stacks and implementation guides.</p>
            <Link to="/project" className="btn-primary text-white px-6 py-3 rounded-xl font-semibold inline-block transition-all">
              Generate Ideas
            </Link>
          </div>
        </div>

        {/* Recent Activity & Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 gradient-text">My Teams</h3>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-gray-600 mb-4">No teams yet. Ready to build something amazing?</p>
              <Link to="/find" className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                Find Your First Team →
              </Link>
            </div>
          </div>

          <div className="card p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 gradient-text">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <div className="font-medium">Welcome to HackMate!</div>
                  <div className="text-sm text-gray-600">Complete your profile to get started</div>
                </div>
              </div>
              <div className="text-center py-8">
                <Link to="/settings" className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                  Complete Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
