'use client'
import Reveal from './Reveal'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Pricing = () => {

  const router = useRouter()
  
  return (
    <section id="pricing" className="scroll-mt-24 py-24">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <Reveal>
                <div className="mx-auto mb-16 max-w-3xl text-center">
                    <h2 className="mb-2 text-sm font-semibold tracking-wide text-blue-600 uppercase">Pricing</h2>
                    <h3 className="mb-4 text-3xl font-bold md:text-4xl">Free for Now, All Features</h3>
                    <p className="text-lg text-slate-600">We&apos;re in MVP mode and providing the complete platform free to all users as we build with our community.</p>
                </div>
            </Reveal>

            <div className="flex justify-center">
                <Reveal>
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 p-12 shadow-2xl">
                        <div className="absolute right-0 top-0 rounded-bl-full bg-blue-600 px-6 py-2 text-xs font-bold text-white">MVP LAUNCH</div>
                        
                        <div className="mb-8">
                            <h4 className="mb-2 text-4xl font-bold text-blue-600">Free</h4>
                            <p className="text-slate-600">All features included</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-bold text-slate-900">$0</span>
                            <span className="ml-2 text-slate-600">/forever</span>
                        </div>

                        <ul className="mb-10 space-y-4">
                            {[
                            "Unlimited AI messages",
                            "Smart flashcards & adaptive quizzes",
                            "Unlimited document uploads",
                            "Study planner & progress tracking",
                            "Multi-language support",
                            "Study groups & collaboration",
                            "Full document analysis",
                            ].map((t) => (
                            <li key={t} className="flex items-center gap-3 text-slate-700">
                                <Check className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                <span className="font-medium">{t}</span>
                            </li>
                            ))}
                        </ul>

                        <motion.button
                            onClick={() => router.push('/sign-in')}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            Start Learning Free
                        </motion.button>

                        <p className="mt-6 text-center text-xs text-slate-600">No credit card required • No hidden fees • Cancel anytime</p>
                    </div>
                </Reveal>
            </div>

            <Reveal>
                <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <h3 className="mb-4 text-2xl font-bold text-slate-900">Why Free for Now?</h3>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600">
                    We believe everyone should have access to world-class AI learning tools. Our mission is to democratize education, and that starts with providing full platform access to all users from day one. As we grow and improve, our pricing may evolve, but we&apos;re committed to keeping core features accessible.
                    </p>
                </div>
            </Reveal>
        </motion.div>
    </section>
  )
}

export default Pricing