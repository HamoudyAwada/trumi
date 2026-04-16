import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import './MainLayout.css'

export default function MainLayout() {
  return (
    <div className="main-layout">
      <Outlet />
      <BottomNav />
    </div>
  )
}
