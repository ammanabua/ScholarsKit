'use client'
import Reveal from './Reveal'
import StepCard from './StepCard'

const HowItWorks = () => {
  return (
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
  )
}

export default HowItWorks