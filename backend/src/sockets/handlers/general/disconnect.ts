import { leaveRoom } from '@src/services/room.service.js';
import { getUser } from '@src/services/user.service.js';
import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';
import logger from '@src/utils/logger.utils.js';

export const getDisconnectEventCallback = (_io: ChatGyanSocketServer, socket: ChatGyanSocket) => {
  return async (reason: string, description: string) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user disconnected', { reason, description });
      return;
    }

    logger.info(`${socket.data.user.id} disconnected`, {
      userId: socket.data.user.id,
      reason,
      description,
    });

    const userId = socket.data.user.id;

    const user = await getUser(userId);
    if (user?.room) {
      await leaveRoom(userId, user.room.toString());

      // Broadcast room update to all other users
      socket.broadcast.emit('roomUpdated', user.room.toString());
    }
  };
};
