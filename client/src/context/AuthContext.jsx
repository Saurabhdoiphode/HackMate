import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is authenticated on mount
  useEffect(() => {
    verifyToken()
  }, [])

  const verifyToken = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axios.get('http://localhost:4000/auth/verify')
      setUser(res.data.user)
    } catch (err) {
      console.error('Token verification failed:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:4000/auth/login', { email, password })
      const { token: newToken, user: userData } = res.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:4000/auth/register', { name, email, password })
      const { token: newToken, user: userData } = res.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      }
    }
  }

  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('http://localhost:4000/auth/forgot-password', { email })
      return { success: true, data: res.data }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to send reset email' 
      }
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post('http://localhost:4000/auth/reset-password', { token, newPassword })
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Password reset failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    loading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}