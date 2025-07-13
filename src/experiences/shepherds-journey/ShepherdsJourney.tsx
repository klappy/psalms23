import React, { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Volume2, VolumeX } from 'lucide-react'

interface Verse {
  id: number
  text: string
  scene: string
  color: string
}

const verses: Verse[] = [
  {
    id: 1,
    text: "The Lord is my shepherd; I shall not want.",
    scene: "green-pastures",
    color: "shepherd"
  },
  {
    id: 2,
    text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    scene: "still-waters",
    color: "primary"
  },
  {
    id: 3,
    text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    scene: "righteousness-path",
    color: "sacred"
  },
  {
    id: 4,
    text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    scene: "valley-shadow",
    color: "purple"
  },
  {
    id: 5,
    text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
    scene: "table-prepared",
    color: "sacred"
  },
  {
    id: 6,
    text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever.",
    scene: "house-lord",
    color: "shepherd"
  }
]

const ShepherdsJourney: React.FC = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentVerse, setCurrentVerse] = useState(0)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const { scrollXProgress } = useScroll({
    container: containerRef,
    target: containerRef
  })

  const handleVerseClick = (verseIndex: number) => {
    setCurrentVerse(verseIndex)
    // Scroll to the verse
    const verseElement = document.getElementById(`verse-${verseIndex}`)
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleAudio = () => {
    setIsMuted(!isMuted)
    setIsAudioPlaying(!isAudioPlaying)
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-shepherd-900 via-shepherd-800 to-shepherd-900">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Verse Navigation */}
      <div className="absolute top-20 left-0 right-0 z-40 px-4">
        <div className="flex justify-center space-x-2">
          {verses.map((verse, index) => (
            <button
              key={verse.id}
              onClick={() => handleVerseClick(index)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                currentVerse === index
                  ? 'bg-white text-shepherd-900 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {verse.id}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Scrolling Container */}
      <div 
        ref={containerRef}
        className="h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex h-full" style={{ width: `${verses.length * 100}vw` }}>
          {verses.map((verse, index) => (
            <div
              key={verse.id}
              id={`verse-${index}`}
              className="relative w-screen h-full flex-shrink-0"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Parallax Background Layers */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Sky Layer (Slowest) */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200"
                  style={{
                    x: useTransform(scrollXProgress, [index / verses.length, (index + 1) / verses.length], [0, -100])
                  }}
                >
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
                    <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-40 left-1/3 w-12 h-12 bg-white rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
                  </div>
                </motion.div>

                {/* Mountain Layer (Medium) */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1/2"
                  style={{
                    x: useTransform(scrollXProgress, [index / verses.length, (index + 1) / verses.length], [0, -150])
                  }}
                >
                  <div className="absolute bottom-0 left-0 w-full h-full">
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-700 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-600 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-500 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Scene-specific elements */}
                {verse.scene === 'green-pastures' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                    style={{
                      x: useTransform(scrollXProgress, [index / verses.length, (index + 1) / verses.length], [0, -200])
                    }}
                  >
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-shepherd-400 via-shepherd-300 to-transparent"></div>
                    {/* Grass tufts */}
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-0 w-2 h-8 bg-shepherd-500 rounded-t-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      ></div>
                    ))}
                  </motion.div>
                )}

                {verse.scene === 'still-waters' && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1/2"
                    style={{
                      x: useTransform(scrollXProgress, [index / verses.length, (index + 1) / verses.length], [0, -200])
                    }}
                  >
                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary-400 via-primary-300 to-transparent"></div>
                    {/* Water ripples */}
                    <div className="absolute bottom-0 left-0 w-full h-full">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bottom-0 w-full h-2 bg-white/20 rounded-full animate-pulse"
                          style={{
                            bottom: `${i * 20}px`,
                            animationDelay: `${i * 0.5}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {verse.scene === 'valley-shadow' && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      x: useTransform(scrollXProgress, [index / verses.length, (index + 1) / verses.length], [0, -200])
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900"></div>
                    {/* Shadow effects */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </motion.div>
                )}
              </div>

              {/* Verse Content */}
              <div className="relative z-10 h-full flex items-center justify-center px-8">
                <motion.div
                  className="max-w-2xl text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="mb-8">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-sm font-medium">
                      Verse {verse.id}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-script font-bold text-white text-shadow leading-relaxed mb-6">
                    {verse.text}
                  </h2>
                  
                  <div className="flex justify-center space-x-4">
                    <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                      Meditate
                    </button>
                    <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                      Share
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Interactive Elements */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex items-center space-x-4">
                  <div className="text-white/60 text-sm">
                    Swipe to continue the journey
                  </div>
                  <div className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShepherdsJourney