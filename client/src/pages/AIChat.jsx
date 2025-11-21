import React, { useState } from 'react'
import axios from 'axios'

export default function AIChat(){
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your HackMate AI assistant. I can help you with team formation, project ideas, skill development, and hackathon strategies. What would you like to know? 🤖'
    }
  ])
  const [loading, setLoading] = useState(false)
  
  const send = async () => {
    if (!input.trim() || loading) return
    
    const userMessage = input.trim()
    setInput('')
    setHistory(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    
    try {
      const response = await axios.post('http://localhost:4000/ai/chat', {
        message: userMessage,
        context: 'hackathon assistance'
      })
      
      const aiResponse = response.data.response || 'Sorry, I couldn\'t process that request.'
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse,
        source: response.data.source
      }])
    } catch (err) {
      console.error('AI chat error:', err)
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting. You can ask me about team formation, project ideas, or hackathon strategies!',
        source: 'error'
      }])
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }
  
  const quickPrompts = [
    "Help me find the right teammates",
    "What makes a good hackathon project?",
    "How do I improve my coding skills?",
    "Suggest a project idea for beginners",
    "What roles are needed in a hackathon team?"
  ]
  
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI Assistant 🤖</h1>
          <p className="text-xl text-gray-200">Get personalized advice for hackathon success</p>
        </div>
        
        <div className="card rounded-2xl overflow-hidden">
          {/* Chat History */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {history.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white text-gray-800 shadow-sm border'
                }`}>
                  <div className="text-sm font-medium mb-1">
                    {message.role === 'user' ? 'You' : 'HackMate AI'}
                    {message.source && (
                      <span className="text-xs ml-2 opacity-75">
                        ({message.source === 'fallback' ? 'offline' : 'ai'})
                      </span>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border max-w-xs lg:max-w-md px-4 py-3 rounded-xl">
                  <div className="text-sm font-medium mb-1">HackMate AI</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Prompts */}
          <div className="px-6 py-4 bg-white border-t">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Input */}
            <div className="flex space-x-3">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about teams, projects, or hackathon strategies..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                disabled={loading}
              />
              <button 
                onClick={send}
                disabled={loading || !input.trim()}
                className="btn-primary text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {loading ? '🔄' : '🚀'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
