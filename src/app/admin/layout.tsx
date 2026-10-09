'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/authContext';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100">
        <p className="text-sm font-medium text-slate-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

