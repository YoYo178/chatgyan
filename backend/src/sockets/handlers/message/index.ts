import { getSendMessageEventCallback } from './sendMessage.js';
import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';

export function registerMessageHandlers(io: ChatGyanSocketServer, socket: ChatGyanSocket) {
  socket.on('sendMessage', getSendMessageEventCallback(io, socket));
}