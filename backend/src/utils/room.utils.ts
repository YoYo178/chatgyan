import {
  DEFAULT_SYSTEM_ROOM_CONFIG,
  MAX_SYSTEM_ROOMS,
  ROOM_NAMES,
} from '@src/config/room.config.js';
import { Room } from '@src/models/room.model.js';
import type { IRoom, IRoomPublicView } from '@src/types/room.types.js';
import logger from './logger.utils.js';

export const populateRoomData = async () => {
  const rooms = await Room.find({ isSystemGenerated: true }).lean().exec();

  if (MAX_SYSTEM_ROOMS - rooms.length <= 0) return;

  logger.info('Generating system rooms...');
  const availableRoomNames = [...ROOM_NAMES];

  for (let i = 0; i != MAX_SYSTEM_ROOMS; i++) {
    const roomCode = `cg${String(i + 1).padStart(3, '0')}`;

    if (rooms.find((room) => room.code === roomCode)) continue;

    const roomName =
      availableRoomNames[
        Math.floor(Math.random() * availableRoomNames.length)
      ] || 'General Room';

    availableRoomNames.splice(availableRoomNames.indexOf(roomName), 1);

    await Room.create({
      ...DEFAULT_SYSTEM_ROOM_CONFIG,
      name: roomName,
      code: roomCode,
      owner: null,
    });

    logger.info(`Created room "${roomCode}" successfully.`);
  }
};

export function generateRoomCode(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function sanitizeRoomObj(
  room: IRoom,
  userID: string,
): IRoom | IRoomPublicView {
  const isUserInRoom = room.members.some(
    (mem) => mem.user.toString() === userID,
  );

  if (!isUserInRoom)
    return {
      ...room,
      code: undefined,
      members: undefined,
    };

  return room;
}
