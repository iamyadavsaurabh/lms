import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'





const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
        {/* Mount NavBar  */}
        <NavBar />
        <div className='flex'>
          {/* Mount Sidebar  */}
          <Sidebar />
          <div className='flex-1'>
            {/* Render Outlet  */}
            {<Outlet />}
          </div>
        </div>

        {/* Footer */}
        <Footer />

    </div>
  )
}

export default Educator