'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getAdminSocket(): Socket | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('voltix_admin_access_token');
  if (!token) return null;

  if (!socket) {
    socket = io('http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to Voltix Realtime Server as Admin');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Voltix Realtime Server');
    });
  }

  return socket;
}

export function disconnectAdminSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

