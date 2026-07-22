import { ChatGyanSocketServer } from '@src/types/socket.types.ts';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        email: string;
      };
      io: ChatGyanSocketServer;
    }
  }
}
