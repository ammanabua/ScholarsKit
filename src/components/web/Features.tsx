import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Reveal from "./Reveal";

const Features = () => {
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


  return (
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
  )
}

export default Features