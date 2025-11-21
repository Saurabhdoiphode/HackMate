import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Dashboard from './pages/Dashboard'
import FindTeammates from './pages/FindTeammates'
import CreateTeam from './pages/CreateTeam'
import TeamRoom from './pages/TeamRoom'
import ProjectIdea from './pages/IdeaGenerator'
import AIChat from './pages/AIChat'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth()
  
  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <Link to="/" className="text-2xl font-bold text-white">HackMate AI</Link>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-purple-200 transition-colors font-medium">Dashboard</Link>
                <Link to="/find" className="text-white hover:text-purple-200 transition-colors font-medium">Find Teams</Link>
                <Link to="/project" className="text-white hover:text-purple-200 transition-colors font-medium">Ideas</Link>
                <Link to="/chat" className="text-white hover:text-purple-200 transition-colors font-medium">AI Chat</Link>
                <Link to="/settings" className="text-white hover:text-purple-200 transition-colors font-medium">Settings</Link>
                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm">Hi, {user?.name}!</span>
                  <button
                    onClick={logout}
                    className="text-white hover:text-purple-200 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/" className="text-white hover:text-purple-200 transition-colors font-medium">Home</Link>
                <Link to="/project" className="text-white hover:text-purple-200 transition-colors font-medium">Ideas</Link>
                <Link to="/login" className="btn-primary text-white px-4 py-2 rounded-lg font-medium">Sign In</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          <Route path="/project" element={<ProjectIdea/>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/find" element={<ProtectedRoute><FindTeammates/></ProtectedRoute>} />
          <Route path="/create-team" element={<ProtectedRoute><CreateTeam/></ProtectedRoute>} />
          <Route path="/team/:id" element={<ProtectedRoute><TeamRoom/></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><AIChat/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
