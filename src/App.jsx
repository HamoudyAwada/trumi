import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages (to be built out)
import Home from './pages/Home'
import Goals from './pages/Goals'
import Character from './pages/Character'
import Achievements from './pages/Achievements'
import Onboarding from './pages/Onboarding'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/character" element={<Character />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
