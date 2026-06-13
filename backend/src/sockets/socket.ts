import { requireSocketAuth } from '@src/middlewares/auth.middleware.js';
import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';
import { handleSocketConnection } from './connection.js';

export function setupSocket(io: ChatGyanSocketServer) {
  io.use(requireSocketAuth);
  io.on('connection', (socket: ChatGyanSocket) => handleSocketConnection(io, socket));
}