import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { forgotPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    
    const result = await forgotPassword(email)
    
    if (result.success) {
      setMessage(`Password reset link sent! For demo: ${result.data.demoUrl}`)
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">🔑</span>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">Forgot Password?</h2>
            <p className="text-gray-600">No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          {message ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-800">{message}</p>
              </div>
              <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white py-3 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
              >
                {loading ? '📧 Sending...' : '📧 Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}