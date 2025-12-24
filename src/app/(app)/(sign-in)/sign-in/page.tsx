'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'callback_failed') {
      toast.error('Sign in failed. Please try again.');
    }
  }, [searchParams]);

  const handleSignIn = () => {
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-200">     
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Link href="/">
          <Image src="/logo-black.svg" alt="Logo" width={75} height={25} className="mx-auto mb-6" />
        </Link>
        <div className="max-w-sm">
          <h3 className="text-xl font-semibold mb-6 text-center text-slate-800">Welcome Back</h3>
          <p className="text-sm text-slate-600 text-center mb-6">
            Sign in to access your account
          </p>
          <button
            onClick={handleSignIn}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In with Cognito
          </button>
          <p className="mt-6 text-center text-sm text-slate-800">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
