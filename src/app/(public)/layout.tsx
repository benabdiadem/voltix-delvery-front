import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck } from 'lucide-react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-green-600 font-extrabold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center font-black">
              V
            </div>
            <span className="text-slate-900">Voltix <span className="text-green-600">Delivery</span></span>
          </Link>
          <nav className="flex items-center space-x-4 sm:space-x-6 text-sm font-semibold text-slate-600">
            <Link href="/privacy" className="hover:text-green-600 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-green-600 transition">Terms</Link>
            <Link href="/support" className="hover:text-green-600 transition">Support</Link>
            <Link href="/delete-account" className="hover:text-red-600 transition text-xs text-red-500">Delete Account</Link>
            <Link href="/login" className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition">Admin Portal</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Voltix Delivery Algeria. Built for university campus delivery.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/support" className="hover:underline">Campus Support</Link>
            <Link href="/delete-account" className="hover:underline text-red-500">Data Deletion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

