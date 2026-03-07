'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const GeneralLoader = () => {
  return (
    <motion.div
      className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/95 z-50'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
    >
        <Image src="/logo-white.svg" alt="Loading..." width={50} height={50} className="animate-pulse mx-auto" />
        <p className="text-white ml-2 animate-pulse">Loading...</p>
    </motion.div>
  )
}

export default GeneralLoader