"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Bot, Check, CheckCircle2, ChevronDown, Github, Globe, Instagram, Linkedin, Menu, PlayCircle, Star, Target, Twitter, Zap } from "lucide-react";

import StepCard from "@/components/web/StepCard";

type Faq = { q: string; a: string };

export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [yearly, setYearly] = useState(false);
  const proPrice = yearly ? "$115" : "$12";
  const teamPrice = yearly ? "$279" : "$29";

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Navbar scroll effect and scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      setNavbarScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinkClass = "text-slate-600 hover:text-blue-600 transition-colors font-medium";

  const features = useMemo(
    () => [
      {
        icon: (<Image src="/artificial-intelligence.png" alt="AI Tutor Chat Icon" width={80} height={80} className="w-20 h-20" />),
        title: "AI Tutor Chat",
        desc: "Get instant explanations, ask unlimited questions, and receive personalized guidance 24/7 from your AI study companion.",
      },
      {
        icon: (<Image src="/flash-card.png" alt="Layers Icon" width={80} height={80} className="w-20 h-20" />),
        title: "Smart Flashcards",
        desc: "AI-generated flashcards that adapt to your memory patterns using spaced repetition algorithms for optimal retention.",
      },
      {
        icon: (<Image src="/brain.png" alt="Clipboard Icon" width={80} height={80} className="w-20 h-20" />),
        title: "Adaptive Quizzes",
        desc: "Dynamic quizzes that adjust difficulty based on your performance, targeting weak areas while reinforcing strengths.",
      },
      {
        icon: (<Image src="/planner.png" alt="Calendar Icon" width={80} height={80} className="w-20 h-20" />),
        title: "Study Planner",
        desc: "Intelligent scheduling that optimizes your study sessions based on exam dates, difficulty levels, and your personal rhythm.",
      },
      {
        icon: (<Image src="/document.png" alt="File Text Icon" width={80} height={80} className="w-20 h-20" />),
        title: "Document Analysis",
        desc: "Upload PDFs, notes, or textbooks and get instant summaries, key concept extraction, and generated practice questions.",
      },
      {
        icon: (<Image src="/partners.png" alt="Users Icon" width={80} height={80} className="w-20 h-20" />),
        title: "Study Groups",
        desc: "Collaborate with friends using AI-moderated study sessions, shared flashcards, and competitive leaderboards.",
      },
    ],
    []
  );

  const faqs: Faq[] = useMemo(
    () => [
      {
        q: "How does the AI tutor work?",
        a: "Our AI uses advanced language models trained specifically on educational content. It can explain complex topics, answer follow-up questions, generate practice problems, and adapt explanations to your level of understanding.",
      },
      {
        q: "Can I upload my own study materials?",
        a: "Yes! Pro and Study Group plans support unlimited document uploads including PDFs, Word documents, images, and text files. Our AI analyzes the content and generates personalized study materials like flashcards and quizzes.",
      },
      {
        q: "Is my data private and secure?",
        a: "Absolutely. We use enterprise-grade encryption and never share your personal data or study materials with third parties. You can delete your data at any time.",
      },
      {
        q: "What subjects does StudyAI support?",
        a: "StudyAI supports virtually all subjects: Math, Sciences, Computer Science, History, Literature, Economics, Medicine, Law, and Languages.",
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Yes, you can cancel anytime. If you cancel, you keep access until the end of your current billing period. We also offer a 7-day money-back guarantee.",
      },
    ],
    []
  );

  return (
    <div className="bg-white text-slate-900">
      {/* NAV */}
      <nav
        className={[
          "fixed top-0 z-50 w-full border-b backdrop-blur",
          navbarScrolled ? "bg-white/95 shadow-sm border-slate-200" : "bg-white/80 border-slate-200",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2"
              aria-label="Scroll to top"
            >
              <span className="flex h-10 w-10 items-center justify-center">
                <Image src="/logo-black.svg" alt="Logo" width={16} height={16} className="h-10 w-10" />
              </span>
              <span className="text-xl font-bold">
                ScholarsKit
              </span>
            </button>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={navLinkClass}>
                Features
              </a>
              <a href="#how-it-works" className={navLinkClass}>
                How It Works
              </a>
              <a href="#testimonials" className={navLinkClass}>
                Reviews
              </a>
              <a href="#pricing" className={navLinkClass}>
                Pricing
              </a>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Get Started Free
              </motion.button>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? <XIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={mobileOpen ? "md:hidden border-t border-slate-200 bg-white" : "hidden"}>
          <div className="px-4 py-4 space-y-2">
            {[
              ["#features", "Features"],
              ["#how-it-works", "How It Works"],
              ["#testimonials", "Reviews"],
              ["#pricing", "Pricing"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                {label}
              </a>
            ))}
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Get Started Free
            </motion.button>
          </div>
        </div>
      </nav>

      {/* HERO */}
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
                  Free forever plan
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

      {/* STATS */}
      {/* <Reveal>
        <section className="border-y border-slate-200 bg-slate-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <Stat value="2M+" label="Active Students" className="text-blue-600" />
              <Stat value="50M+" label="Questions Answered" className="text-violet-600" />
              <Stat value="94%" label="Grade Improvement" className="text-pink-600" />
              <Stat value="4.9/5" label="User Rating" className="text-cyan-600" />
            </div>
          </div>
        </section>
      </Reveal> */}

      {/* FEATURES */}
      <section id="features" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-blue-600 uppercase">Features</h2>
              <h3 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need to Excel</h3>
              <p className="text-lg text-slate-600">
                Our AI adapts to your unique learning style, creating a personalized education experience that evolves with you.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              return (
                <Reveal key={f.title}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-colors hover:bg-white"
                  >
                    <div className="mb-6 flex justify-center">
                      {f.icon}
                    </div>
                    <h4 className="mb-3 text-center text-xl font-bold">{f.title}</h4>
                    <p className="text-center leading-relaxed text-slate-600">{f.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-24 bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-blue-600 uppercase">How It Works</h2>
              <h3 className="text-3xl font-bold md:text-4xl">Start Learning in Minutes</h3>
            </div>
          </Reveal>

          <div className="relative grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 md:block" />

            <Reveal>
              <StepCard step="1" badgeClass="bg-blue-600 shadow-blue-200" title="Set Your Goals" desc="Tell us what you want to learn, your current level, and when you need to master it by." />
            </Reveal>
            <Reveal>
              <StepCard step="2" badgeClass="bg-violet-600 shadow-violet-200" title="AI Creates Plan" desc="Our AI analyzes your input and generates a personalized curriculum with resources and milestones." />
            </Reveal>
            <Reveal>
              <StepCard step="3" badgeClass="bg-pink-600 shadow-pink-200" title="Learn & Improve" desc="Study with AI guidance, track your progress, and watch your understanding grow exponentially." />
            </Reveal>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="scroll-mt-24 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-blue-600 uppercase">Testimonials</h2>
              <h3 className="text-3xl font-bold md:text-4xl">Loved by Students Worldwide</h3>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            <Reveal>
              <Testimonial
                quote="StudyAI helped me go from a C to an A in Organic Chemistry. The AI explanations are incredibly clear, and the flashcards saved me hours of study time."
                name="Sarah Chen"
                title="Pre-Med Student, UCLA"
                img="https://static.photos/people/200x200/42"
              />
            </Reveal>
            <Reveal>
              <Testimonial
                quote="As a working professional studying for the CFA, time is precious. StudyAI's document analysis feature turned my 500-page textbook into manageable study sessions."
                name="Marcus Johnson"
                title="Financial Analyst, NYC"
                img="https://static.photos/people/200x200/88"
              />
            </Reveal>
            <Reveal>
              <Testimonial
                quote="The adaptive quizzes are game-changing. It's like having a tutor who knows exactly what I struggle with and focuses on those areas."
                name="Emily Rodriguez"
                title="Computer Science, MIT"
                img="https://static.photos/people/200x200/156"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="scroll-mt-24 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-2 text-sm font-semibold tracking-wide text-blue-600 uppercase">Pricing</h2>
              <h3 className="mb-4 text-3xl font-bold md:text-4xl">Simple, Student-Friendly Pricing</h3>
              <p className="text-lg text-slate-600">Start free, upgrade when you need more power.</p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <span className={yearly ? "font-medium text-slate-500" : "font-bold text-slate-900"}>Monthly</span>

                <button
                  onClick={() => setYearly((v) => !v)}
                  className="relative h-8 w-14 rounded-full bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Toggle billing period"
                >
                  <motion.span
                    layout
                    className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white"
                    animate={{ x: yearly ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                </button>

                <span className={yearly ? "font-bold text-slate-900" : "font-medium text-slate-500"}>
                  Yearly <span className="text-sm font-bold text-emerald-600">(Save 20%)</span>
                </span>
              </div>
            </div>
          </Reveal>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-colors hover:bg-white">
                <h4 className="mb-2 text-2xl font-bold">Free</h4>
                <p className="mb-6 text-slate-500">Perfect for trying out</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-slate-500">/month</span>
                </div>

                <ul className="mb-8 space-y-4">
                  {["50 AI messages/month", "Basic flashcards", "3 document uploads", "Community support"].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-emerald-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full rounded-full border-2 border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700">
                  Get Started
                </button>
              </div>
            </Reveal>

            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-blue-500 bg-blue-600 p-8 text-white shadow-xl">
                <div className="absolute right-0 top-0 rounded-bl-lg bg-pink-500 px-4 py-1 text-xs font-bold">POPULAR</div>
                <h4 className="mb-2 text-2xl font-bold">Pro</h4>
                <p className="mb-6 text-blue-100">For serious students</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{proPrice}</span>
                  <span className="text-blue-100">/month</span>
                </div>

                <ul className="mb-8 space-y-4">
                  {["Unlimited AI messages", "Advanced flashcards & quizzes", "Unlimited document uploads", "Study planner & analytics", "Priority support"].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-blue-100" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full rounded-full bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50">
                  Start Pro Trial
                </button>
              </div>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition-colors hover:bg-white">
                <h4 className="mb-2 text-2xl font-bold">Study Group</h4>
                <p className="mb-6 text-slate-500">Collaborate with friends</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{teamPrice}</span>
                  <span className="text-slate-500">/month</span>
                </div>

                <ul className="mb-8 space-y-4">
                  {["Everything in Pro", "Up to 5 members", "Shared study materials", "Group progress tracking", "Admin controls"].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-slate-700">
                      <Check className="h-5 w-5 text-emerald-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full rounded-full border-2 border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700">
                  Start Group Plan
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const open = openFaq === idx;
              return (
                <Reveal key={f.q}>
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <button
                      onClick={() => setOpenFaq((cur) => (cur === idx ? null : idx))}
                      className="flex w-full items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="font-semibold">{f.q}</span>
                      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      </motion.span>
                    </button>

                    <motion.div
                      initial={false}
                      animate={{ height: open ? "auto" : 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100 px-6 py-4 text-slate-600">{f.a}</div>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
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

      {/* SCROLL TO TOP BUTTON */}
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

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center">
                  <Image src='/logo-black.svg' alt="Logo" width={32} height={32} className="h-10 w-10" />
                </div>
                <span className="text-xl font-bold">ScholarsKit</span>
              </div>
              <p className="mb-4 text-sm text-slate-600">Empowering students worldwide with AI-powered learning tools.</p>
              <div className="flex gap-4">
                <a href="#" className="text-slate-500 hover:text-slate-900" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-900" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-900" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-slate-500 hover:text-slate-900" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <FooterCol title="Product" links={[["Features", "#features"], ["Pricing", "#pricing"], ["API", "#"], ["Integrations", "#"]]} />
            <FooterCol title="Resources" links={[["Documentation", "#"], ["Help Center", "#"], ["Community", "#"], ["Blog", "#"]]} />
            <FooterCol title="Company" links={[["About", "#"], ["Careers", "#"], ["Privacy", "#"], ["Terms", "#"]]} />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row">
            <p className="text-sm text-slate-500">&copy; 2026 ScholarsKit. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Globe className="h-4 w-4" />
              English (US)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- components ---------------- */

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// function Stat({ value, label, className }: { value: string; label: string; className: string }) {
//   return (
//     <div className="space-y-2">
//       <p className={`text-4xl font-bold ${className}`}>{value}</p>
//       <p className="text-sm font-medium text-slate-600">{label}</p>
//     </div>
//   );
// }



function Testimonial({ quote, name, title, img }: { quote: string; name: string; title: string; img: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-4 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="mb-6 italic text-slate-600">&quot;{quote}&quot;</p>
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={name} className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h5 className="mb-4 font-semibold text-slate-900">{title}</h5>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-slate-600 hover:text-slate-900 transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- tiny icon helpers ---------------- */

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

// function FileTextIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       {...props}
//     >
//       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//       <path d="M14 2v6h6" />
//       <path d="M16 13H8" />
//       <path d="M16 17H8" />
//       <path d="M10 9H8" />
//     </svg>
//   );
// }
