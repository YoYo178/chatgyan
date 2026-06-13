import type {
  ChatGyanSocket,
  ChatGyanSocketServer,
} from '@src/types/socket.types.js';

import { getCreateRoomEventCallback } from './createRoom.js';
import { getDeleteRoomEventCallback } from './deleteRoom.js';
import { getJoinRoomEventCallback } from './joinRoom.js';
import { getLeaveRoomEventCallback } from './leaveRoom.js';
import { getUpdateRoomEventCallback } from './updateRoom.js';

export function registerRoomHandlers(
  io: ChatGyanSocketServer,
  socket: ChatGyanSocket,
) {
  socket.on('createRoom', getCreateRoomEventCallback(io, socket));
  socket.on('joinRoom', getJoinRoomEventCallback(io, socket));
  socket.on('leaveRoom', getLeaveRoomEventCallback(io, socket));
  socket.on('updateRoom', getUpdateRoomEventCallback(io, socket));
  socket.on('deleteRoom', getDeleteRoomEventCallback(io, socket));
}
