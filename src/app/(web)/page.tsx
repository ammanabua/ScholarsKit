
export default function Page() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center font-sans">
      {/* Hero Section */}
      <section className="w-full max-w-3xl px-6 py-16 text-center">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-4">ScholarsKit</h1>
        <p className="text-xl text-blue-700 mb-8">Your AI-powered study companion for smarter, faster learning.</p>
        <a
          href="/sign-in"
          className="inline-block bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 transition font-semibold text-lg"
        >
          Get Started Free
        </a>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-4xl px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-blue-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4"/></svg>
          <h3 className="font-bold text-lg mb-2 text-slate-700">AI-Powered Q&A</h3>
          <p className="text-gray-600">Get instant, accurate answers to your study questions, powered by advanced AI.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-blue-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <h3 className="font-bold text-lg mb-2 text-slate-700">Smart Summaries</h3>
          <p className="text-gray-600">Summarize textbooks, notes, and articles in seconds for efficient revision.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <svg className="w-10 h-10 text-blue-600 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <h3 className="font-bold text-lg mb-2 text-slate-700">Collaborative Workspace</h3>
          <p className="text-gray-600">Study together, share notes, and chat with peers in a secure environment.</p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="w-full max-w-2xl px-6 py-8 text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Why ScholarsKit?</h2>
        <p className="text-gray-700 mb-6">Boost your productivity, deepen your understanding, and make learning enjoyable. ScholarsKit adapts to your needs, whether you&apos;re preparing for exams or exploring new topics.</p>
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-xl px-6 py-8 text-center">
        <a
          href="/sign-in"
          className="inline-block bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 transition font-semibold text-lg"
        >
          Start Your Free Trial
        </a>
        <p className="text-sm text-gray-500 mt-2">No credit card required</p>
      </section>
    </main>
  );
}
