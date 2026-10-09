'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../../../lib/api';

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // 1. Authenticate user to obtain token
      const loginRes = await api.post('/auth/login', { email, password });
      const token = loginRes.data.data.accessToken;

      // 2. Call delete account with authentication
      await api.delete('/auth/account', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password, reason },
      });

      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        err.response?.data?.error?.message ||
        'Failed to verify credentials or process deletion. Please verify email and password.'
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
          <Trash2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Request Account & Data Deletion</h1>
        <p className="text-xs text-slate-500">
          In compliance with Google Play Store & Apple App Store account deletion requirements.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Permanent Action:</span>
            <p className="leading-relaxed">
              Deleting your account immediately revokes all active sessions, clears push notification tokens, and anonymizes your personal identification (name, phone, email).
            </p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="p-6 rounded-xl bg-green-50 border border-green-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">Account Deleted Successfully</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your Voltix account and personal credentials have been removed. You will no longer be able to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {status === 'error' && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Voltix Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.dz"
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Reason for leaving (Optional)</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Graduated, no longer on campus, etc."
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Verifying & Deleting...' : 'Confirm Account & Data Deletion'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

