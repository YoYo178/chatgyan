import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import http from 'http';
import path from 'path';

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { Server as SocketIOServer } from 'socket.io';

import ENV, { NODE_ENVS } from '@src/common/env.js';

import { CORSConfig } from '@src/config/cors.config.js';
import { connectDB } from '@src/config/db.config.js';
import { ASSETS_PATH } from '@src/config/files.config.js';

import { errorHandler } from '@src/middlewares/errorHandler.middleware.js';
import logger, { morganStream } from '@src/utils/logger.utils.js';

import APIRouter from '@src/routes/index.js';
import { setupSocket } from './sockets/socket.js';
import type {
  ChatGyanSocketServer,
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types/socket.types.js';

/* =========================================================================== */

// Connect to MongoDB
await connectDB();

// Create an express app and bind it to an HTTP server
const app = express();
const server = http.createServer(app);

// Setup Socket.IO on the same server object
const io: ChatGyanSocketServer = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: CORSConfig,
  serveClient: false,
});

// Add socket event listeners
setupSocket(io);

// Add middlewares
app.use(cors(CORSConfig)); // CORS
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
app.use(cookieParser()); // Cookie parser

// Attach logger middlewares
if (ENV.NODE_ENV === NODE_ENVS.DEVELOPMENT) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}

// Attach security middleware, only in production!
if (ENV.NODE_ENV === NODE_ENVS.PRODUCTION) {
  if (!ENV.DISABLE_HELMET) {
    app.use(helmet());
  }
}

// Serve static files from the "assets" directory, with CORS headers
app.use(
  '/assets',
  (_: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(ASSETS_PATH)),
);

// Handle missing static files
app.use('/assets', (_, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

// Attach IO instance via express middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

// Attach our main router that handles all the paths of the server
app.use('/api', APIRouter);

// Add error handler middleware
app.use(errorHandler);

// Start the server
const PORT = ENV.PORT || 3000;
server.listen(PORT, () => {
  logger.info('Express server started on port: ' + ENV.PORT.toString());
});
