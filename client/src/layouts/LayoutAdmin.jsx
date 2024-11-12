import { Outlet } from 'react-router-dom'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import HeaderAdmin from '../components/admin/HeaderAdmin'

const LayoutAdmin = () => {
  return (
    <div className='flex h-screen bg-green-50'>
      <SidebarAdmin />

      <div className='flex-1 flex flex-col'>
        <HeaderAdmin />
        <main className='flex-1 p-6 overflow-y-auto bg-gray-100'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutAdmin