import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import AdminTopBarMobile from '../components/layout/AdminTopBarMobile'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar />
      <AdminTopBarMobile />
      <div className="lg:pl-64">
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
