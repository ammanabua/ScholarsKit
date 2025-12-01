import React from 'react'
import Image from 'next/image'

const GeneralLoader = () => {
  return (
    <div className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/95 z-50'
    style={{
              animation: 'fadeInUp 0.8s ease-out 0.4s both'
            }}>
        <Image src="/logo-white.svg" alt="Loading..." width={50} height={50} className="animate-pulse mx-auto" />
        <p className="text-white ml-2 animate-pulse">Loading...</p>
    </div>
  )
}

export default GeneralLoader