import { motion } from 'framer-motion';
import { ArrowRight, Bot, CheckCircle2, PlayCircle, Target, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'

const Hero = () => {
    
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 lg:pb-28">
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-200/60 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violet-200/60 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center lg:text-left"
                >
                    <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 lg:mx-0">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                        Powered by Advanced AI
                    </div>

                    <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
                    Master Any Subject with Your{" "}
                        <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                            AI Study Companion
                        </span>
                    </h1>

                    <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-slate-600 lg:mx-0">
                    Personalized learning paths, intelligent flashcards, and adaptive quizzes that evolve with your progress. Study smarter, not harder.
                    </p>

                    <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                        <motion.button
                            onClick={() => router.push('/sign-in')}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            Start Learning Free <ArrowRight className="h-5 w-5" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 hover:border-blue-300"
                        >
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                            Watch Demo
                        </motion.button>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500 lg:justify-start">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            Free MVP plan
                        </div>
                    </div>
                </motion.div>

                {/* Right */}
                <div className="relative flex items-center justify-center lg:h-[600px]">
                    <motion.div
                    animate={{ y: [0, -16, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full max-w-lg"
                    >
                        {/* Main card */}
                        <motion.div
                            whileHover={{ rotate: 0, scale: 1.01 }}
                            initial={{ rotate: 2 }}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
                        >
                            <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500">
                                <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                <p className="font-semibold">StudyAI Assistant</p>
                                <p className="text-xs text-slate-500">Online now</p>
                                </div>
                            </div>
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                Active
                            </span>
                            </div>

                            <div className="space-y-4">
                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm text-slate-600">Explain quantum entanglement like I&apos;m 5</p>
                            </div>
                            <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                                <p className="text-sm text-slate-700">
                                Imagine you have two magic dice that always show the same number, even when you&apos;re far apart! That&apos;s kind of like quantum entanglement...
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <motion.span
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                className="h-2 w-2 rounded-full bg-blue-500"
                                />
                                <motion.span
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                                className="h-2 w-2 rounded-full bg-blue-500"
                                />
                                <motion.span
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                className="h-2 w-2 rounded-full bg-blue-500"
                                />
                            </div>
                            </div>
                        </motion.div>

                        {/* Floating badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                            className="absolute -top-6 -right-6 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100">
                                <Zap className="h-6 w-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">85% Faster</p>
                                <p className="text-xs text-slate-500">Learning Speed</p>
                            </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.4 }}
                            className="absolute -bottom-6 -left-6 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                                <Target className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">92% Accuracy</p>
                                <p className="text-xs text-slate-500">Quiz Score</p>
                            </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero