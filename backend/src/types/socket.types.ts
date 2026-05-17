import { Server, Socket } from 'socket.io';

// TODO
export interface ServerToClientEvents {
    ping: () => void;
}

// This generic represents the data type that is to be sent with the ack, null by default
export type AckFunc<T = null> = (options: AckOptions<T>) => void;
export interface AckOptions<T> { success: boolean; data?: T; error?: string }
// TODO
export interface ClientToServerEvents {
    ping: () => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    user: {
        id: string,
        username: string,
        email: string,
    };
}

export type ChatGyanSocketServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type ChatGyanSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;