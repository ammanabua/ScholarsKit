'use client'
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function SignInPage() {
  const router = useRouter()

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(8, 'Min 8 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch('/api/auth/login-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const contentType = res.headers.get('content-type') || ''
        const data = contentType.includes('application/json') ? await res.json() : await res.text()
        if (!res.ok) throw new Error(data.error || 'Sign-in failed')
        toast.success('Signed in successfully!')
        router.replace('/dashboard')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Sign-in failed'
        // Surface error on email field for visibility
        setFieldError('email', msg)
        toast.error(msg)
      } finally {
        setSubmitting(false)
      }
    },
  })
  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-200">     
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Link href="/">
          <Image src="/logo-black.svg" alt="Logo" width={75} height={25} className="mx-auto mb-6" />
        </Link>
        <form className="max-w-sm" onSubmit={formik.handleSubmit}>
          <h3 className="text-xl font-semibold mb-6 text-center text-slate-800">Sign In</h3>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-800">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className={`w-full border px-3 py-2 rounded text-slate-800 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-500'}`}
              placeholder="example@email.com" 
              required 
              value={formik.values.email} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-slate-800">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className={`w-full border px-3 py-2 rounded text-slate-800 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-500'}`}
              required 
              value={formik.values.password} 
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
          <span className="text-sm text-slate-800 flex justify-end mb-2">Forgot password? <a href="/forgot-password" className="text-blue-600 hover:underline ml-1">Click Here</a></span>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:bg-blue-300" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
          <p className="mt-4 text-center text-sm text-slate-800">
            Don&apos;t have an account? <Link href="/sign-up" className="text-blue-600 hover:underline">Sign Up</Link>
          </p>
        </form>
        <div className="my-6 max-w-sm mx-4 border-t" />
        <Link
          href="/api/auth/login"
          className="block text-center bg-white w-full text-blue-600 hover:text-white hover:bg-blue-600/90 cursor-pointer font-semibold py-2 border border-blue-600 rounded"
        >
          Continue with AWS Cognito
        </Link>
      </div>
    </div>
  );
}
