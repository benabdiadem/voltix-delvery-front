'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../lib/authContext';
import { api } from '../../../lib/api';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('admin@voltix.dz');
  const [password, setPassword] = useState('Admin123456!');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post('/auth/login', {
        identifier,
        password,
      });

      if (res.data.success) {
        const { user, accessToken } = res.data.data;
        if (user.role !== 'ADMIN') {
          setError('Access restricted to platform administrators.');
          setSubmitting(false);
          return;
        }
        login(accessToken, user);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        'Failed to connect to backend API at http://localhost:5000'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-500 rounded-2xl mx-auto flex items-center justify-center font-extrabold text-2xl text-slate-950 shadow-lg shadow-green-500/20 mb-4">
            V
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Voltix Delivery</h2>
          <p className="text-sm text-slate-400 mt-1">Campus Operations Administration</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              Admin Email / Phone
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-11 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="admin@voltix.dz"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-11 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          Demo Admin Credentials: <code className="text-slate-400">admin@voltix.dz</code> / <code className="text-slate-400">Admin123456!</code>
        </div>
      </div>
    </div>
  );
}

