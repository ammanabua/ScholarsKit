'use client'
import Link from "next/link";
import Image from "next/image";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function SignUpPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        router.push('/sign-in?registered=true');
      } catch (err: any) {
        setFieldError('email', err.message); // Show API error as a form error
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col w-full min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <Link href="/">
          <Image src="/logo-black.svg" alt="Logo" width={75} height={25} className="mx-auto mb-6" />
        </Link>
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-xl font-bold mb-6 text-center text-slate-800">Sign Up</h2>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-slate-800">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-500'} px-3 py-2 rounded text-slate-800`}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-slate-800">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-500'} px-3 py-2 rounded text-slate-800`}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-slate-800">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`w-full border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-500'} px-3 py-2 rounded text-slate-800`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
            ) : null}
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-green-300" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className="mt-4 text-center text-sm text-slate-800">
            Already have an account? <Link href="/sign-in" className="text-green-600 hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
