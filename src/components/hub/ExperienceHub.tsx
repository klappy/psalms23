import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mountain, 
  Eye, 
  BookOpen, 
  Globe,
  Star,
  Heart,
  Shield,
  Home
} from 'lucide-react'

interface Experience {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  color: string
  gradient: string
  path: string
}

const experiences: Experience[] = [
  {
    id: 'shepherds-journey',
    title: "The Shepherd's Journey",
    subtitle: "Horizontal Adventure",
    description: "Embark on a side-scrolling adventure through the psalm's landscapes with hand-painted watercolor aesthetics and interactive elements.",
    icon: <Mountain className="w-8 h-8" />,
    color: 'shepherd',
    gradient: 'from-shepherd-500 to-shepherd-700',
    path: '/shepherds-journey'
  },
  {
    id: 'divine-perspective',
    title: "Divine Perspective",
    subtitle: "Vertical Scroll with Depth",
    description: "Experience a top-down heavenly view with isometric 3D styling, rich textures, and dynamic lighting effects.",
    icon: <Eye className="w-8 h-8" />,
    color: 'primary',
    gradient: 'from-primary-500 to-primary-700',
    path: '/divine-perspective'
  },
  {
    id: 'living-scripture',
    title: "Living Scripture",
    subtitle: "Immersive Storybook",
    description: "Each verse unfolds as an interactive cinematic scene with mixed media, photography, and subtle 3D elements.",
    icon: <BookOpen className="w-8 h-8" />,
    color: 'sacred',
    gradient: 'from-sacred-500 to-sacred-700',
    path: '/living-scripture'
  },
  {
    id: 'sacred-landscape',
    title: "Sacred Landscape",
    subtitle: "360° Panoramic Experience",
    description: "Immerse yourself in panoramic views that rotate as you scroll, with photorealistic scenes and artistic filters.",
    icon: <Globe className="w-8 h-8" />,
    color: 'purple',
    gradient: 'from-purple-500 to-purple-700',
    path: '/sacred-landscape'
  }
]

const ExperienceHub: React.FC = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const handleExperienceSelect = (path: string) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-sacred-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-shepherd-500 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-primary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 pt-16 pb-8 px-6 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center mb-4">
          <Star className="w-8 h-8 text-sacred-400 mr-3" />
          <h1 className="text-4xl md:text-5xl font-script font-bold text-white text-shadow">
            Psalm 23
          </h1>
          <Star className="w-8 h-8 text-sacred-400 ml-3" />
        </div>
        <p className="text-xl md:text-2xl text-slate-300 font-light mb-2">
          Immersive Experiences
        </p>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Choose your journey through the sacred text with four unique interactive experiences
        </p>
      </motion.div>

      {/* Experience Grid */}
      <motion.div 
        className="relative z-10 px-6 pb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
              onClick={() => handleExperienceSelect(experience.path)}
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${experience.gradient} p-8 h-80 glass-effect border border-white/20 hover:border-white/40 transition-all duration-300`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon and Title */}
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm mr-4 group-hover:bg-white/30 transition-colors">
                      {experience.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {experience.title}
                      </h3>
                      <p className="text-white/80 text-sm font-medium">
                        {experience.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-sm leading-relaxed flex-grow">
                    {experience.description}
                  </p>

                  {/* Interactive Elements */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-xs">Interactive</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-xs">Immersive</span>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="relative z-10 text-center pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p className="text-slate-400 text-sm">
          "The Lord is my shepherd; I shall not want." — Psalm 23:1
        </p>
      </motion.div>
    </div>
  )
}

export default ExperienceHub