import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';
import type { WsConnectionStatus } from './types';

const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3001/ws';

interface WsStore {
  socket: Socket | null;
  status: WsConnectionStatus;
  lastEvent: string | null;
  connect: (token: string) => void;
  disconnect: () => void;
}

export const useWsStore = create<WsStore>((set, get) => ({
  socket: null,
  status: 'disconnected',
  lastEvent: null,

  connect: (token: string) => {
    const existing = get().socket;
    if (existing?.connected) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    socket.on('connect', () => {
      set({ socket, status: 'connected' });
    });

    socket.on('disconnect', () => {
      set({ status: 'disconnected' });
    });

    socket.on('reconnecting', () => {
      set({ status: 'reconnecting' });
    });

    socket.on('reconnect', () => {
      set({ status: 'connected' });
    });

    socket.on('reconnect_error', () => {
      set({ status: 'disconnected' });
    });

    socket.on('points.earned', (data: any) => {
      set({ lastEvent: `points.earned: +${data.amount}` });
    });

    socket.on('order.status_changed', (data: any) => {
      set({ lastEvent: `order.status_changed: ${data.orderCode} → ${data.status}` });
    });

    socket.on('notification', (data: any) => {
      set({ lastEvent: `notification: ${data.title}` });
    });

    set({ socket, status: 'connecting' as any });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ socket: null, status: 'disconnected', lastEvent: null });
  },
}));
