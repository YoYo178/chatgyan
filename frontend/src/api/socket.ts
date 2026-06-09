import { io } from 'socket.io-client';
import { SERVER_URL } from './client';
import type { ChatGyanSocket } from '../types/socket.types';

export const socket: ChatGyanSocket = io(SERVER_URL, {
    withCredentials: true,
    autoConnect: false,
    path: '/socket.io/'
}) as ChatGyanSocket;