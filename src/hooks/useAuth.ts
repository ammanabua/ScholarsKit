'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/session';

export function useAuth(user?: User) {

    const router = useRouter()

    useEffect(() => {
        if (user === undefined) {
            // User is not logged in, redirect to login page
            router.push('/sign-in');
        }
    }, [user, router])
}