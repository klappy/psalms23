import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

const LivingScripture: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="h-screen bg-gradient-to-b from-sacred-900 via-sacred-800 to-sacred-900">
      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
        >
          <Home className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Living Scripture</h1>
          <p className="text-white/80 mb-8">Immersive storybook with cinematic scenes</p>
          <div className="text-white/60">Coming Soon...</div>
        </div>
      </div>
    </div>
  )
}

export default LivingScripture