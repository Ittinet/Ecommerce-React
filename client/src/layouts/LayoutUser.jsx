import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const LayoutUser = () => {
  return (
    <div>
      <MainNav />

      <main className='h-full px-4 mt-4 mx-auto'>
        <Outlet />
      </main>

    </div>
  )
}

export default LayoutUser