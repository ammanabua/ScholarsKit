import React from 'react'
import Reveal from './Reveal'
import { Star } from 'lucide-react'

const Testimonials = () => {
  return (
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
                    title="History and International Relations, UMCP"
                    img="https://static.photos/people/200x200/42"
                />
                </Reveal>
                <Reveal>
                <Testimonial
                    quote="As a working professional studying for the CFA, time is precious. StudyAI's document analysis feature turned my 500-page textbook into manageable study sessions."
                    name="Marcus Johnson"
                    title="MBA Candidate, UOTP"
                    img="https://static.photos/people/200x200/88"
                />
                </Reveal>
                <Reveal>
                <Testimonial
                    quote="The adaptive quizzes are game-changing. It's like having a tutor who knows exactly what I struggle with and focuses on those areas."
                    name="Emily Rodriguez"
                    title="Computer Science, MIU"
                    img="https://static.photos/people/200x200/156"
                />
                </Reveal>
            </div>
        </div>
    </section>
  )
}

export default Testimonials

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