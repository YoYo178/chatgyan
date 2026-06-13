import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';
import logger from '@src/utils/logger.utils.js';

export const getDisconnectingEventCallback = (
  _io: ChatGyanSocketServer,
  socket: ChatGyanSocket,
) => {
  return (reason: string, description: string) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user disconnecting', {
        reason,
        description,
      });
      return;
    }

    logger.info(`${socket.data.user.id} disconnecting`, {
      userId: socket.data.user.id,
      reason,
      description,
    });
  };
};
