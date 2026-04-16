import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout        from './components/ui/MainLayout'
import Home              from './pages/Home'
import Character         from './pages/Character'
import Goals             from './pages/Goals'
import AddGoal           from './pages/AddGoal'
import Achievements      from './pages/Achievements'
import Chat              from './pages/Chat'
import Onboarding        from './pages/Onboarding'
import OnboardingStep1   from './pages/OnboardingStep1'
import OnboardingStep2   from './pages/OnboardingStep2'
import OnboardingStep3   from './pages/OnboardingStep3'
import OnboardingStep4   from './pages/OnboardingStep4'
import OnboardingStep5   from './pages/OnboardingStep5'
import NotFound          from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen pages — no nav bar */}
        <Route path="/onboarding"        element={<Onboarding />} />
        <Route path="/onboarding/step/1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/step/2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/step/3" element={<OnboardingStep3 />} />
        <Route path="/onboarding/step/4" element={<OnboardingStep4 />} />
        <Route path="/onboarding/step/5" element={<OnboardingStep5 />} />
        <Route path="/chat"              element={<Chat />} />

        {/* All main app pages share the BottomNav layout */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              localStorage.getItem('trumi_onboarded')
                ? <Home />
                : <Navigate to="/onboarding" replace />
            }
          />
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
