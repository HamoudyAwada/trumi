import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout     from './components/ui/MainLayout'
import Home          from './pages/Home'
import Character     from './pages/Character'
import Goals         from './pages/Goals'
import AddGoal       from './pages/AddGoal'
import Achievements  from './pages/Achievements'
import Chat          from './pages/Chat'
import Onboarding    from './pages/Onboarding'
import NotFound      from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen pages — no nav bar */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/chat"       element={<Chat />} />

        {/* All main app pages share the BottomNav layout */}
        <Route element={<MainLayout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/goals"        element={<Goals />} />
          <Route path="/add-goal"     element={<AddGoal />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/character"    element={<Character />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
