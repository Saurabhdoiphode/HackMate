import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Settings(){
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skills: '',
    techStack: '',
    expertise: 'Intermediate',
    availability: '',
    github: '',
    portfolio: '',
    region: '',
    workingStyle: 'team'
  })
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    teamInvites: true
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
        techStack: Array.isArray(user.techStack) ? user.techStack.join(', ') : (user.techStack || ''),
        expertise: user.expertise || 'Intermediate',
        availability: user.availability || '',
        github: user.github || '',
        portfolio: user.portfolio || '',
        region: user.region || '',
        workingStyle: user.workingStyle || 'team'
      })
    }
  }, [user])

  const saveProfile = async () => {
    setLoading(true)
    setMessage('')
    try {
      const skillsArray = profile.skills.split(',').map(s => s.trim()).filter(Boolean)
      const techArray = profile.techStack.split(',').map(s => s.trim()).filter(Boolean)
      
      const updateData = {
        ...profile,
        skills: skillsArray,
        techStack: techArray
      }
      
      const result = await updateProfile(updateData)
      
      if (result.success) {
        setMessage('Profile updated successfully! ✨')
      } else {
        setMessage(result.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error('Profile update error:', err)
      setMessage('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-600">Please login to access settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Settings ⚙️</h1>
          <p className="text-xl text-gray-200">Customize your profile and preferences</p>
        </div>
        
        <div className="card p-8 rounded-2xl">
          <h3 className="text-2xl font-bold gradient-text mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                placeholder="Your full name" 
                value={profile.name} 
                onChange={e => handleProfileChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Level</label>
              <select 
                value={profile.expertise} 
                onChange={e => handleProfileChange('expertise', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea 
                placeholder="Tell others about yourself, your interests, and what drives you..." 
                value={profile.bio} 
                onChange={e => handleProfileChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <input 
                placeholder="React, Python, Design, etc. (comma separated)" 
                value={profile.skills} 
                onChange={e => handleProfileChange('skills', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
              <input 
                placeholder="Node.js, MongoDB, Docker, etc. (comma separated)" 
                value={profile.techStack} 
                onChange={e => handleProfileChange('techStack', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input 
                placeholder="https://github.com/yourname" 
                value={profile.github} 
                onChange={e => handleProfileChange('github', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
              <input 
                placeholder="https://yourportfolio.com" 
                value={profile.portfolio} 
                onChange={e => handleProfileChange('portfolio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <input 
                placeholder="San Francisco, Remote, etc." 
                value={profile.region} 
                onChange={e => handleProfileChange('region', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Style</label>
              <select 
                value={profile.workingStyle} 
                onChange={e => handleProfileChange('workingStyle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="solo">Prefer Solo Work</option>
                <option value="paired">Pair Programming</option>
                <option value="team">Team Collaboration</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8">
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
            <button 
              onClick={saveProfile} 
              disabled={loading}
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
            >
              {loading ? '💾 Saving...' : '✨ Save Profile'}
            </button>
          </div>
        </div>
        
        <div className="card p-8 rounded-2xl">
          <h3 className="text-2xl font-bold gradient-text mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={notifications.email}
                onChange={e => setNotifications({...notifications, email: e.target.checked})}
                className="w-5 h-5 text-purple-600 mr-3 rounded focus:ring-purple-500"
              />
              <span className="font-medium">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={notifications.teamInvites}
                onChange={e => setNotifications({...notifications, teamInvites: e.target.checked})}
                className="w-5 h-5 text-purple-600 mr-3 rounded focus:ring-purple-500"
              />
              <span className="font-medium">Team invite notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}