import React from 'react'

const Loading = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin '></div>
    </div>
  )
}

export default Loading