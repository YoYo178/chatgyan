import { Message } from '@src/models/message.model.js';
import type {
  ClientToServerEvents,
  ChatGyanSocket,
  ChatGyanSocketServer,
} from '@src/types/socket.types.js';
import { sendMessageSchema } from '@src/schemas/messages.schema.js';
import logger from '@src/utils/logger.utils.js';

export const getSendMessageEventCallback = (
  io: ChatGyanSocketServer,
  socket: ChatGyanSocket,
): ClientToServerEvents['sendMessage'] => {
  return async (roomId, messageContent, ack) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to send message');
      return;
    }

    try {
      // Validate input
      sendMessageSchema.parse({ roomId, message: messageContent });

      const message = await Message.create({
        content: messageContent,
        sender: socket.data.user.id,
        room: roomId,
      });

      logger.info(`${socket.data.user.id} sent message in room ${roomId}`, {
        userId: socket.data.user.id,
        roomId,
        messageLength: messageContent.length,
      });

      // Broadcast message to everyone in the room (including sender for confirmation)
      io.to(roomId).emit('newMessage', roomId, socket.data.user.id, message.toObject());

      ack({ success: true });
    } catch (err) {
      logger.error('Error sending message', {
        userId: socket.data.user.id,
        roomId,
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      ack({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };
};
