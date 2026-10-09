'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { LogOut, Bell, Radio } from 'lucide-react';
import { getAdminSocket } from '../lib/socket';

export function Header() {
  const { user, logout } = useAuth();
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  useEffect(() => {
    const socket = getAdminSocket();
    if (socket) {
      if (socket.connected) setRealtimeConnected(true);
      socket.on('connect', () => setRealtimeConnected(true));
      socket.on('disconnect', () => setRealtimeConnected(false));
    }
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            realtimeConnected
              ? 'bg-green-100 text-green-800'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          <Radio className={`w-3 h-3 mr-1.5 ${realtimeConnected ? 'animate-pulse text-green-600' : 'text-amber-600'}`} />
          {realtimeConnected ? 'Realtime Live' : 'Connecting Realtime...'}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        )}

        <button
          onClick={logout}
          className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

