import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';

import { getCreateRoomEventCallback } from './createRoom.js';

export function registerRoomHandlers(
  io: ChatGyanSocketServer,
  socket: ChatGyanSocket,
) {
  socket.on('createRoom', getCreateRoomEventCallback(io, socket));
}
