import React, { useState } from 'react'
import axios from 'axios'

export default function ProjectIdea(){
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const extractIdeaText = (ideaPayload) => {
    if (!ideaPayload) return 'No idea returned. Try adjusting your prompt.'
    if (typeof ideaPayload === 'string') return ideaPayload
    if (Array.isArray(ideaPayload)) return ideaPayload.join('\n')
    if (ideaPayload.choices?.[0]?.text) return ideaPayload.choices[0].text
    if (ideaPayload.text) return ideaPayload.text
    if (ideaPayload.fallback?.choices?.[0]?.text) return ideaPayload.fallback.choices[0].text
    return JSON.stringify(ideaPayload, null, 2)
  }

  const generate = async () => {
    if (!prompt.trim()) {
      setOutput('Please describe the idea you want help with, then try again.')
      return
    }

    setLoading(true)
    setOutput(null)
    try {
      const res = await axios.post('http://localhost:4000/ai/idea', { prompt })
      const ideaText = extractIdeaText(res.data.idea)
      setOutput(ideaText)
    } catch (err) {
      console.error('Idea generation failed:', err?.response?.data || err.message)
      const fallbackIdea = err?.response?.data?.fallback
      if (fallbackIdea) {
        setOutput(extractIdeaText(fallbackIdea))
      } else {
        setOutput('Error generating idea. Please try again in a few seconds. If the issue persists, ensure HackMate AI (Ollama/LM Studio) is running or use the fallback idea.')
      }
    } finally {
      setLoading(false)
    }
  }
  
  const examplePrompts = [
    'AI-powered sustainability platform for smart cities',
    'Blockchain-based voting system with privacy protection', 
    'AR/VR social platform for remote team collaboration',
    'Machine learning tool for early disease detection',
    'Decentralized marketplace for renewable energy trading'
  ]
  
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">AI Project Idea Generator 💡</h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">Transform your concepts into hackathon-ready project ideas with AI-powered architecture, tech stacks, and implementation guides.</p>
        </div>

        {/* Input Section */}
        <div className="card p-8 rounded-2xl mb-8">
          <h3 className="text-2xl font-bold gradient-text mb-6">Describe Your Vision</h3>
          <div className="space-y-6">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your project idea, problem you want to solve, or technology you want to explore..."
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
              rows={4}
            />
            
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="btn-primary text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50"
              >
                {loading ? '🤖 Generating...' : '✨ Generate Project Idea'}
              </button>
              <button
                onClick={() => setPrompt(examplePrompts[Math.floor(Math.random() * examplePrompts.length)])}
                className="glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all"
              >
                🎲 Random Example
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-3">Try these example prompts:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.slice(0, 4).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-3 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        {(output || loading) && (
          <div className="card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold gradient-text mb-6">Your Project Blueprint 🚀</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="text-gray-600">AI is crafting your perfect project idea...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                    {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                  </pre>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary text-white px-6 py-3 rounded-lg font-medium transition-all">
                    📋 Copy Blueprint
                  </button>
                  <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    💾 Save Project
                  </button>
                  <button className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    👥 Find Team for This
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {!output && !loading && (
          <div className="card p-12 rounded-2xl text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready to Create Something Amazing?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Our AI will help you transform any idea into a complete hackathon project with architecture, tech stack recommendations, and step-by-step implementation guides.</p>
            <p className="text-sm text-gray-500">Enter your idea above to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
