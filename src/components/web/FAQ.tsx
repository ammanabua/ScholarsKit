'use client'
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import Reveal from './Reveal';

type Faq = { q: string; a: string };

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
  )
}

export default FAQ