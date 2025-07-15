import React from 'react'
import {dummyEducatorData} from '../../assets/assets'
import {UserButton, useUser} from '@clerk/clerk-react'
import {Link} from 'react-router-dom'
import {assets} from '../../assets/assets'




const NavBar = () => {

   
   
  const educatorData = dummyEducatorData
  const {user} = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      {/* Logo */}
      <Link to='/'>
        <img src={assets.logo} alt="logo" className='w-28 lg:w-32' />
      </Link>
      
      {/* User Button */}
      <div className='flex items-center gap-5 text-gray-500 relative'>
        {/* if we have user details then show it */}
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {user ? <UserButton /> :  <img className='max-w-8' src={assets.profile_img} alt=""/>}

      </div>

    </div>
  )
}

export default NavBar