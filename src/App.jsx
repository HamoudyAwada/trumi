import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { hasCompletedOnboarding } from './services/supabase'

import GlobalHeader      from './components/ui/GlobalHeader'
import BackgroundPattern from './components/ui/BackgroundPattern'
import MainLayout        from './components/ui/MainLayout'
import Home              from './pages/Home'
import Character         from './pages/Character'
import Goals             from './pages/Goals'
import Values            from './pages/Values'
import AddGoal           from './pages/AddGoal'
import GoalDetail        from './pages/GoalDetail'
import Achievements      from './pages/Achievements'
import Chat              from './pages/Chat'
import Onboarding        from './pages/Onboarding'
import OnboardingStep1   from './pages/OnboardingStep1'
import OnboardingStep2   from './pages/OnboardingStep2'
import OnboardingStep4   from './pages/OnboardingStep4'
import OnboardingStep5   from './pages/OnboardingStep5'
import OnboardingGoals   from './pages/OnboardingGoals'
import AccountCreation   from './pages/AccountCreation'
import AccountSettings   from './pages/AccountSettings'
import Login             from './pages/Login'
import LogEntry          from './pages/LogEntry'
import BadgeWall         from './pages/BadgeWall'
import Journey           from './pages/Journey'
import NotFound          from './pages/NotFound'

// Checks Supabase (with localStorage as a fast-path cache) before rendering home
function HomeGuard() {
  const [status, setStatus] = useState(
    localStorage.getItem('trumi_onboarded') ? 'done' : 'checking'
  )

  useEffect(() => {
    if (status !== 'checking') return
    hasCompletedOnboarding()
      .then(completed => {
        if (completed) localStorage.setItem('trumi_onboarded', 'true')
        setStatus(completed ? 'done' : 'redirect')
      })
      .catch(() => {
        // If Supabase is unreachable, fall back to localStorage flag
        setStatus(localStorage.getItem('trumi_onboarded') ? 'done' : 'redirect')
      })
  }, [status])

  if (status === 'checking') return null  // brief blank while we check
  if (status === 'redirect') return <Navigate to="/onboarding" replace />
  return <Home />
}

// Renders GlobalHeader above all app pages except Chat and Onboarding
function AppShell() {
  return (
    <>
      <GlobalHeader />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundPattern />
      <Routes>
        {/* No GlobalHeader — Chat and Onboarding are self-contained */}
        <Route path="/onboarding"        element={<Onboarding />} />
        <Route path="/onboarding/step/1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/step/2" element={<OnboardingStep2 />} />
        <Route path="/onboarding/step/4" element={<OnboardingStep4 />} />
        <Route path="/onboarding/step/5" element={<OnboardingStep5 />} />
        <Route path="/onboarding/goals"  element={<OnboardingGoals />} />
        <Route path="/account-creation"  element={<AccountCreation />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/chat"              element={<Chat />} />

        {/* All other pages get the GlobalHeader via AppShell */}
        <Route element={<AppShell />}>
          {/* Standalone pages (no bottom nav) */}
          <Route path="/add-goal"      element={<AddGoal />} />
          <Route path="/log-entry/:id" element={<LogEntry />} />
          <Route path="/badges"        element={<BadgeWall />} />
          <Route path="/journey"       element={<Journey />} />

          {/* Main app pages (bottom nav via MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/"             element={<HomeGuard />} />
            <Route path="/goals"        element={<Goals />} />
            <Route path="/goal/:id"     element={<GoalDetail />} />
            <Route path="/values"       element={<Values />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/character"        element={<Character />} />
            <Route path="/account-settings" element={<AccountSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
