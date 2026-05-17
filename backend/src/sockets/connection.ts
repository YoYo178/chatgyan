import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';
import logger from '@src/utils/logger.utils.js';

export function handleSocketConnection(io: ChatGyanSocketServer, socket: ChatGyanSocket) {
  if (!socket.data?.user) {
    logger.warn('Unauthenticated user attempted to connect');
    return;
  }

  logger.info(`Client connected: ${socket.data.user.id}`, {
    userId: socket.data.user.id,
    socketId: socket.id,
  });

  // Have the user join a room by their own ObjectId for a stable identity
  socket.join(socket.data.user.id);
}