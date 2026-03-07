'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React from 'react'
import Reveal from './Reveal'

const CTA = () => {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-violet-600" />
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Ready to Transform Your Learning?</h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-blue-100">
              Join 2 million+ students who are studying smarter, not harder. Start your free trial today.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.button
                onClick={() => router.push('/sign-in')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-sm hover:bg-blue-50"
              >
                Get Started Free
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-white/10"
              >
                Contact Sales
              </motion.button>
            </div>

            <p className="mt-6 text-sm text-blue-200">No credit card required • 14-day free trial • Cancel anytime</p>
          </Reveal>
        </div>
    </section>
  )
}

export default CTA