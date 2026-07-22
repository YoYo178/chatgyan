import { Router } from 'express';

import { validate } from '@src/middlewares/validation.middleware.js';
import { roomIdParamsSchema } from '@src/schemas/room.schemas.js';

import { getAllRooms, getRoomById } from '@src/controllers/rooms.controller.js';

const RoomsRouter: Router = Router();

RoomsRouter.get('/', getAllRooms);
RoomsRouter.get('/:roomId', validate({ params: roomIdParamsSchema }), getRoomById);

export default RoomsRouter;
