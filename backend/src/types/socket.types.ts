import { Server, Socket } from 'socket.io';
import type { IRoom } from './room.types.js';
import type { IMessage } from './message.types.js';

export interface ServerToClientEvents {
  /** For users NOT in a room */
  roomCreated: (room: IRoom) => void;
  roomUpdated: (roomId: string) => void;
  roomDeleted: (roomId: string, ownerId: string) => void;

  /** For users IN a room */
  memberJoined: (roomId: string, userId: string) => void;
  memberLeft: (roomId: string, userId: string) => void;

  newMessage: (roomId: string, userId: string, message: IMessage) => void;
}

// This generic represents the data type that is to be sent with the ack, null by default
export type AckFunc<T = null> = (options: AckOptions<T>) => void;
export interface AckOptions<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ClientToServerEvents {
  createRoom: (
    name: string,
    type: 'topic' | 'course',
    typeName: string,
    visibility: 'public' | 'private',
    memberLimit: number,
    ack: AckFunc<IRoom>,
  ) => void;

  updateRoom: (
    roomId: string,
    name: string,
    visibility: 'public' | 'private',
    memberLimit: number,
    ack: AckFunc,
  ) => void;

  joinRoom: (
    payload: { method: 'code' | 'id'; data: string },
    ack: AckFunc<{ roomId: string }>,
  ) => void;
  leaveRoom: (roomId: string, ack: AckFunc) => void;
  deleteRoom: (roomId: string, ack: AckFunc) => void;

  sendMessage: (roomId: string, message: string, ack: AckFunc) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export type ChatGyanSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export type ChatGyanSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
