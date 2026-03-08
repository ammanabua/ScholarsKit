'use client'
import React from 'react'
import Reveal from './Reveal'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const Demo = () => {
  return (
    <section className="py-24">
        <motion.div 
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <Reveal className="order-2 lg:order-1">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-4">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <div className="ml-4 font-mono text-sm text-slate-400">StudyAI Console</div>
                        </div>

                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-400">➜</span>
                                <div>
                                    <span className="text-blue-400">Analyzing</span>
                                    <span className="text-slate-300"> biology_notes.pdf...</span>
                                    <span className="ml-2 text-emerald-400">✓ Complete</span>
                                </div>
                            </div>

                            <div className="rounded-lg border-l-2 border-blue-500 bg-slate-800 p-4">
                                <p className="mb-2 text-slate-300">Generated 24 flashcards from Chapter 3: Cellular Respiration</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded bg-blue-900/50 px-2 py-1 text-xs text-blue-200">Mitochondria</span>
                                    <span className="rounded bg-violet-900/50 px-2 py-1 text-xs text-violet-200">ATP Cycle</span>
                                    <span className="rounded bg-pink-900/50 px-2 py-1 text-xs text-pink-200">Glycolysis</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="text-emerald-400">➜</span>
                                <div>
                                    <span className="text-blue-400">Creating</span>
                                    <span className="text-slate-300"> adaptive quiz module...</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-500">
                                <motion.div
                                    animate={{ scale: [1, 1.25, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                                    className="h-2 w-2 rounded-full bg-blue-500"
                                />
                                <span>AI is generating personalized study recommendations...</span>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <Reveal className="order-1 lg:order-2">
                    <h3 className="mb-6 text-3xl font-bold md:text-4xl">
                    Upload Any Material.
                    <br />
                    <span className="text-blue-600">Instantly Get Study Resources.</span>
                    </h3>
                    <p className="mb-6 text-lg text-slate-600">
                    Simply upload your textbooks, lecture notes, or PDFs. Our AI extracts key concepts, generates summaries, creates flashcards, and builds practice quizzes automatically.
                    </p>

                    <ul className="space-y-4">
                    {["Supports PDF, DOCX, TXT, and images", "Multi-language support (50+ languages)", "Math equation recognition & solving"].map((t) => (
                        <li key={t} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                            <Check className="h-4 w-4 text-emerald-600" />
                        </span>
                        <span className="text-slate-700">{t}</span>
                        </li>
                    ))}
                    </ul>
                </Reveal>
            </div>
        </motion.div>
        <motion.div 
          className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-blue-600 via-blue-600 to-violet-600 p-16 text-center text-white shadow-2xl mt-16 border border-blue-400/20"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
            <h2 className="mb-4 text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Why ScholarsKit?</h2>
            <p className="text-xl opacity-95 leading-relaxed">
                Boost your productivity, deepen your understanding, and make learning enjoyable. 
                ScholarsKit adapts to your needs, whether you&apos;re preparing for exams or exploring new topics.
            </p>
        </motion.div>
    </section>
  )
}

export default Demo