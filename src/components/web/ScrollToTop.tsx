import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import React from 'react'

const ScrollToTop = ({ showScrollTop }: { showScrollTop: boolean }) => {
  return (
    <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
            opacity: showScrollTop ? 1 : 0,
            scale: showScrollTop ? 1 : 0.8,
            pointerEvents: showScrollTop ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Scroll to top"
        >
        <ArrowRight className="h-5 w-5 rotate-[-90deg]" />
    </motion.button>
  )
}

export default ScrollToTop