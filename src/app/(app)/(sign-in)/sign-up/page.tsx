'use client'
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Link href="/">
          <Image src="/logo-black.svg" alt="Logo" width={75} height={25} className="mx-auto mb-6" />
        </Link>
        <form className="">
          <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Sign Up</h2>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-800">Email</label>
            <input type="email" id="email" name="email" className="w-full border border-slate-500 px-3 py-2 rounded" required />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-slate-800">Password</label>
            <input type="password" id="password" name="password" className="w-full border border-slate-500 px-3 py-2 rounded" required />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-slate-800">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" className="w-full border border-slate-500 px-3 py-2 rounded" required />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700">Sign Up</button>
          <p className="mt-4 text-center text-sm text-slate-800">
            Already have an account? <Link href="/sign-in" className="text-green-600 hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
