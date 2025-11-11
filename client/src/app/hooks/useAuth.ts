'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = (roleRequired?: 'ADMIN' | 'USER') => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userData = localStorage.getItem('user');
      const parsedUser = userData ? JSON.parse(userData) : null;

      if (!token || !role) {
        router.push('/login');
        return;
      }

      if (roleRequired && role !== roleRequired) {
        router.push('/unauthorized');
        return;
      }

      setUser(parsedUser);
    } catch (err) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, roleRequired]);

  return { user, loading };
};
