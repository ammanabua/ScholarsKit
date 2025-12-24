'use client'
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const handleSignUp = () => {
    // Cognito Hosted UI handles both sign-in and sign-up
    // The user can click "Sign up" on the Cognito login page
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Link href="/">
          <Image src="/logo-black.svg" alt="Logo" width={75} height={25} className="mx-auto mb-6" />
        </Link>
        <div>
          <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Create Account</h2>
          <p className="text-sm text-slate-600 text-center mb-6">
            Create a new account to get started
          </p>
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign Up with Cognito
          </button>
          <p className="mt-6 text-center text-sm text-slate-800">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

