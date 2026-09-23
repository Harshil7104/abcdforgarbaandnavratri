import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    // In dev, connect to current host:5000 or fallback to origin
    const socketUrl = window.location.port === '5173' ? 'http://127.0.0.1:5000' : '/';
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Real-time Chat Socket');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from Chat Socket');
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
