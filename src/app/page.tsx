'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/authContext';

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && user.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center font-bold text-2xl text-slate-950 animate-pulse">
          V
        </div>
        <p className="text-sm font-medium text-slate-400">Loading Voltix Delivery Platform...</p>
      </div>
    </div>
  );
}

