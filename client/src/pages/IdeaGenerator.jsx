import React, { useState } from 'react'
import axios from 'axios'

export default function IdeaGenerator(){
  const [preferences, setPreferences] = useState({
    category: 'Web',
    difficulty: 'Intermediate',
    techStack: '',
    theme: '',
    customPrompt: ''
  })
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState(null)
  
  const categories = ['Web', 'Mobile', 'AI/ML', 'Blockchain', 'IoT', 'AR/VR', 'Gaming', 'Fintech', 'Healthcare', 'Education']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']
  const themes = ['Social Impact', 'Sustainability', 'Productivity', 'Entertainment', 'Health & Wellness', 'Finance', 'Education', 'Environment']
  
  const generateIdeas = async () => {
    setLoading(true)
    setIdeas([])
    
    try {
      const prompt = preferences.customPrompt || 
        `Generate 3 innovative ${preferences.category.toLowerCase()} project ideas for a hackathon. 
         Difficulty: ${preferences.difficulty}
         ${preferences.theme ? `Theme: ${preferences.theme}` : ''}
         ${preferences.techStack ? `Tech Stack: ${preferences.techStack}` : ''}
         
         For each idea, provide: title, description, key features, and implementation tips.`
      
      const response = await axios.post('http://localhost:4000/ai/idea', { prompt })
      
      // Parse the AI response into structured ideas
      let generatedIdeas = []
      if (response.data?.idea) {
        const content = response.data.idea.choices?.[0]?.text || response.data.idea
        
        // Try to parse the response into individual ideas
        if (typeof content === 'string') {
          const ideaSections = content.split(/\d+\.|Idea \d+:|Project \d+:/).filter(s => s.trim())
          
          generatedIdeas = ideaSections.slice(0, 3).map((idea, index) => ({
            id: Date.now() + index,
            title: `${preferences.category} Project ${index + 1}`,
            description: idea.trim(),
            category: preferences.category,
            difficulty: preferences.difficulty,
            theme: preferences.theme,
            timestamp: new Date().toLocaleString()
          }))
        }
      }
      
      // Fallback ideas if AI fails
      if (generatedIdeas.length === 0) {
        generatedIdeas = getFallbackIdeas()
      }
      
      setIdeas(generatedIdeas)
    } catch (err) {
      console.error('Idea generation failed:', err)
      setIdeas(getFallbackIdeas())
    } finally {
      setLoading(false)
    }
  }
  
  const getFallbackIdeas = () => {
    const fallbackIdeas = {
      Web: [
        { title: 'Smart Study Planner', description: 'AI-powered study scheduler that adapts to your learning style and creates personalized study plans with progress tracking.' },
        { title: 'Local Business Hub', description: 'Platform connecting local businesses with community members, featuring reviews, events, and loyalty programs.' },
        { title: 'Eco-Tracker Dashboard', description: 'Personal carbon footprint tracker with gamification, challenges, and sustainable lifestyle recommendations.' }
      ],
      Mobile: [
        { title: 'Mood-Based Music Player', description: 'App that analyzes your mood through selfies and creates personalized playlists to match or improve your emotional state.' },
        { title: 'AR Plant Care Assistant', description: 'Augmented reality app that identifies plants and provides real-time care instructions with visual overlays.' },
        { title: 'Skill Swap Community', description: 'Platform where users can exchange skills and knowledge through video tutorials and live sessions.' }
      ],
      'AI/ML': [
        { title: 'Smart Recipe Generator', description: 'AI that creates recipes based on available ingredients, dietary restrictions, and flavor preferences.' },
        { title: 'Language Learning Buddy', description: 'Conversational AI that adapts to your learning pace and provides personalized language practice.' },
        { title: 'Health Symptom Analyzer', description: 'ML model that analyzes symptoms and provides preliminary health insights and care recommendations.' }
      ]
    }
    
    const categoryIdeas = fallbackIdeas[preferences.category] || fallbackIdeas.Web
    return categoryIdeas.map((idea, index) => ({
      ...idea,
      id: Date.now() + index,
      category: preferences.category,
      difficulty: preferences.difficulty,
      theme: preferences.theme || 'General',
      timestamp: new Date().toLocaleString()
    }))
  }
  
  const saveIdea = async (idea) => {
    try {
      // Here you could save to user's saved ideas
      alert(`Idea "${idea.title}" saved to your collection! 💡`)
    } catch (err) {
      console.error('Save failed:', err)
      alert('Failed to save idea. Please try again.')
    }
  }
  
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Project Idea Generator 💡</h1>
          <p className="text-xl text-gray-200">Get AI-powered project ideas tailored to your skills and interests</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preferences Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 rounded-2xl sticky top-8">
              <h2 className="text-xl font-bold mb-4">Customize Your Ideas</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={preferences.category}
                    onChange={e => setPreferences({...preferences, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select 
                    value={preferences.difficulty}
                    onChange={e => setPreferences({...preferences, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme (Optional)</label>
                  <select 
                    value={preferences.theme}
                    onChange={e => setPreferences({...preferences, theme: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Any Theme</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
                  <input 
                    value={preferences.techStack}
                    onChange={e => setPreferences({...preferences, techStack: e.target.value})}
                    placeholder="React, Python, MongoDB..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                  <textarea 
                    value={preferences.customPrompt}
                    onChange={e => setPreferences({...preferences, customPrompt: e.target.value})}
                    placeholder="Describe what kind of project you want to build..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                
                <button 
                  onClick={generateIdeas}
                  disabled={loading}
                  className="w-full btn-primary text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? '🤖 Generating...' : '✨ Generate Ideas'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Ideas Display */}
          <div className="lg:col-span-2">
            {ideas.length === 0 && !loading && (
              <div className="card p-8 rounded-2xl text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Ready to Generate Ideas?</h3>
                <p className="text-gray-600">Customize your preferences and click "Generate Ideas" to get started!</p>
              </div>
            )}
            
            {loading && (
              <div className="card p-8 rounded-2xl text-center">
                <div className="animate-spin text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-2">AI is Thinking...</h3>
                <p className="text-gray-600">Generating creative project ideas based on your preferences</p>
              </div>
            )}
            
            <div className="space-y-6">
              {ideas.map((idea, index) => (
                <div key={idea.id} className="card p-6 rounded-2xl hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold">{idea.title}</h3>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {idea.category}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          {idea.difficulty}
                        </span>
                        {idea.theme && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {idea.theme}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{idea.timestamp}</p>
                    </div>
                    
                    <button 
                      onClick={() => saveIdea(idea)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                    >
                      💾 Save Idea
                    </button>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{idea.description}</p>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => setSelectedIdea(idea)}
                      className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors text-sm font-semibold"
                    >
                      📖 View Details
                    </button>
                    <button 
                      onClick={() => {/* Navigate to create team with this idea */}}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-semibold"
                    >
                      👥 Create Team for This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Idea Detail Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="card p-8 rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedIdea.title}</h2>
              <button 
                onClick={() => setSelectedIdea(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {selectedIdea.category}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {selectedIdea.difficulty}
                </span>
                {selectedIdea.theme && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {selectedIdea.theme}
                  </span>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedIdea.description}</p>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => saveIdea(selectedIdea)}
                  className="flex-1 btn-primary text-white py-3 rounded-xl font-semibold"
                >
                  💾 Save to Collection
                </button>
                <button 
                  onClick={() => setSelectedIdea(null)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}