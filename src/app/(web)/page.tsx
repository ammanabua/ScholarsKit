'use client'
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-10 text-center">
        <div 
          className="mx-auto max-w-4xl"
          style={{
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}
        >
          <div 
            className="mb-6 inline-block"
          >
            <Image src="/logo-black.svg" alt="ScholarsKit Logo" width={80} height={80} />
          </div>
          
          <h1 
            className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.3s both'
            }}
          >
            ScholarsKit
          </h1>
          
          <p 
            className="mb-8 text-xl text-gray-600 md:text-2xl"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.4s both'
            }}
          >
            Your AI-powered study companion for smarter, faster learning, and research.
          </p>
          
          <Link
            href='/dashboard' 
            className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl hover:scale-105"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.5s both'
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div 
              className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2"
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.6s both'
              }}
            >
              <div className="mb-4 text-5xl text-center">🤖</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 text-center">
                AI-Powered Q&A
              </h3>
              <p className="text-gray-600">
                Get instant, accurate answers to your study questions, powered by advanced AI.
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2"
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.7s both'
              }}
            >
              <div className="mb-4 text-5xl text-center">⚡</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 text-center">
                Smart Summaries
              </h3>
              <p className="text-gray-600">
                Summarize textbooks, notes, and articles in seconds for efficient revision.
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className="rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2"
              style={{
                animation: 'fadeInUp 0.8s ease-out 0.8s both'
              }}
            >
              <div className="mb-4 text-5xl text-center">👥</div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 text-center">
                Collaborative Workspace
              </h3>
              <p className="text-gray-600">
                Study together, share notes, and chat with peers in a secure environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="px-6 py-16">
        <div 
          className="mx-auto max-w-4xl rounded-3xl bg-indigo-600 p-12 text-center text-white shadow-2xl"
          style={{
            animation: 'scaleIn 0.8s ease-out 0.9s both'
          }}
        >
          <h2 className="mb-4 text-4xl font-bold">Why ScholarsKit?</h2>
          <p className="text-lg opacity-90">
            Boost your productivity, deepen your understanding, and make learning enjoyable. 
            ScholarsKit adapts to your needs, whether you&apos;re preparing for exams or exploring new topics.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 text-center">
        <div 
          className="mx-auto max-w-2xl"
          style={{
            animation: 'fadeInUp 0.8s ease-out 1s both'
          }}
        >
          <h2 className="mb-6 text-4xl font-bold text-gray-900">
            Start Your Free Trial
          </h2>
          <Link href='/dashboard' className="rounded-full bg-indigo-600 px-10 py-5 text-xl font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl hover:scale-105">
            Get Started Now
          </Link>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(-10px);
          }
          50% {
            transform: translateY(10px);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <footer className="w-full flex items-center justify-center text-slate-800 p-3 mt-8 text-lg">
        <p>ScholarsKit<sup>&trade;</sup> {year}</p>
      </footer>
    </div>
  );
}