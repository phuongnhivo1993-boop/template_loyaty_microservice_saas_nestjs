'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type EventHandler = (data: any) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useWebSocket(handlers: Record<string, EventHandler>) {
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef(handlers);
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  handlersRef.current = handlers;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(`${WS_URL}/ws`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      setConnected(true);
      setReconnecting(false);
    });
    socket.on('disconnect', () => {
      setConnected(false);
    });
    socket.on('connect_error', () => {
      setConnected(false);
      setReconnecting(true);
    });

    const handlerMap = handlersRef.current;
    Object.keys(handlerMap).forEach((event) => {
      socket.on(event, handlerMap[event]);
    });

    socketRef.current = socket;

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit, connected, reconnecting };
}
