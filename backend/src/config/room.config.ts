import type { IRoom } from '@src/types/room.types.js';


export const DEFAULT_SYSTEM_ROOM_CONFIG: Omit<
  IRoom,
  '_id' | 'createdAt' | 'updatedAt'
> = {
  code: '',
  isSystemGenerated: true,
  memberLimit: 10,
  memberCount: 0,
  members: [],
  name: '', // TODO: set this to something random out of a pre-defined list of names
  visibility: 'public',
  owner: null,
  type: 'course',
  typeName: '',
};

export const ROOM_NAMES = ['General Discussion', 'Study Group', 'Q&A Session'];

export const MAX_SYSTEM_ROOMS = Math.min(3, ROOM_NAMES.length);

export const DEFAULT_ROOM_CODE_LENGTH = 6;
