import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-500">
                Hackathon Team
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered teammate matching, real-time collaboration, and project idea generation. 
              Built for hackers, by hackers. 100% free forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard" className="btn-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                🚀 Start Matching
              </Link>
              <Link to="/find" className="glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all">
                🔍 Explore Teams
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Why Choose HackMate?</h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">Everything you need to build amazing teams and win hackathons</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">AI-Powered Matching</h3>
              <p className="text-gray-600">Advanced algorithms analyze skills, experience, and working style to find your perfect teammates automatically.</p>
            </div>
            
            <div className="card p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">Real-time Collaboration</h3>
              <p className="text-gray-600">Team rooms with live chat, Kanban boards, and file sharing. Everything in one place.</p>
            </div>
            
            <div className="card p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">Project Idea Generator</h3>
              <p className="text-gray-600">AI generates hackathon-ready ideas with tech stack recommendations and implementation guides.</p>
            </div>
            
            <div className="card p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">Gamification</h3>
              <p className="text-gray-600">Earn XP, unlock badges, and climb the leaderboard. Track your hackathon journey.</p>
            </div>
            
            <div className="card p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">Developer Tools</h3>
              <p className="text-gray-600">Resume analyzer, skill gap analysis, code reviewer, and deadline planner built-in.</p>
            </div>
            
            <div className="card p-8 rounded-2xl text-center hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="text-xl font-bold mb-4 gradient-text">100% Free</h3>
              <p className="text-gray-600">No hidden fees, no premium plans. Built with open-source tools for the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">10,000+</div>
              <div className="text-gray-200">Developers Matched</div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-200">Teams Formed</div>
            </div>
            <div className="glass p-8 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-200">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Win Your Next Hackathon?</h2>
          <p className="text-xl text-gray-200 mb-8">Join thousands of developers building the future together</p>
          <Link to="/login" className="btn-primary text-white px-12 py-6 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all inline-block">
            Get Started Free 🎯
          </Link>
        </div>
      </section>
    </div>
  )
}
