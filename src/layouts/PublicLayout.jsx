import { Outlet } from 'react-router-dom'
import PublicNavbar from '../components/layout/PublicNavbar'
import BottomNavMobile from '../components/layout/BottomNavMobile'
import Footer from '../components/layout/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNavMobile />
    </div>
  )
}
