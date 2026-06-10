import type { ChatGyanSocket, ChatGyanSocketServer } from '@src/types/socket.types.js';

import { getCreateRoomEventCallback } from './createRoom.js';
import { getJoinRoomEventCallback } from './joinRoom.js';
import { getLeaveRoomEventCallback } from './leaveRoom.js';

export function registerRoomHandlers(
  io: ChatGyanSocketServer,
  socket: ChatGyanSocket,
) {
  socket.on('createRoom', getCreateRoomEventCallback(io, socket));
  socket.on('joinRoom', getJoinRoomEventCallback(io, socket));
  socket.on('leaveRoom', getLeaveRoomEventCallback(io, socket));
}
