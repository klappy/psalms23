import { Routes, Route } from 'react-router-dom'
import ExperienceHub from './components/hub/ExperienceHub'
import ShepherdsJourney from './experiences/shepherds-journey/ShepherdsJourney'
import DivinePerspective from './experiences/divine-perspective/DivinePerspective'
import LivingScripture from './experiences/living-scripture/LivingScripture'
import SacredLandscape from './experiences/sacred-landscape/SacredLandscape'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Routes>
        <Route path="/" element={<ExperienceHub />} />
        <Route path="/shepherds-journey" element={<ShepherdsJourney />} />
        <Route path="/divine-perspective" element={<DivinePerspective />} />
        <Route path="/living-scripture" element={<LivingScripture />} />
        <Route path="/sacred-landscape" element={<SacredLandscape />} />
      </Routes>
    </div>
  )
}

export default App