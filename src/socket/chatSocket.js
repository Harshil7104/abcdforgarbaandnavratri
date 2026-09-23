const Message = require('../models/Message');

/**
 * Initialize Socket.io events for Real-time Masked Chat
 * @param {import('socket.io').Server} io
 */
const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join user's individual notification room
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room user_${userId}`);
      }
    });

    // Join specific match conversation room
    socket.on('join_chat', (matchId) => {
      if (matchId) {
        socket.join(`chat_${matchId}`);
        console.log(`Socket ${socket.id} joined conversation chat_${matchId}`);
      }
    });

    // Leave conversation room
    socket.on('leave_chat', (matchId) => {
      if (matchId) {
        socket.leave(`chat_${matchId}`);
      }
    });

    // Send real-time message through socket
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, matchId, text } = data;
        if (!senderId || !receiverId || !text) return;

        const message = await Message.create({
          senderId,
          receiverId,
          matchId: matchId || receiverId,
          text: text.trim(),
          read: false,
        });

        // Emit to the match chat room
        io.to(`chat_${matchId}`).emit('new_message', message);
        // Also notify the receiver's personal channel
        io.to(`user_${receiverId}`).emit('notification_message', message);
      } catch (err) {
        console.error('Socket message error:', err.message);
        socket.emit('error_message', { message: 'Failed to deliver message' });
      }
    });

    // Typing indicators
    socket.on('typing', ({ matchId, isTyping, userName }) => {
      socket.to(`chat_${matchId}`).emit('user_typing', { isTyping, userName });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initChatSocket;
