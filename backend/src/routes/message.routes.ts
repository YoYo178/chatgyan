import { Router } from 'express';

import { validate } from '@src/middlewares/validation.middleware.js';
import { messagesQuerySchema, messageIdParamsSchema } from '@src/schemas/messages.schema.js';

import { getMessages, getMessageById } from '@src/controllers/messages.controller.js';

const MessagesRouter: Router = Router();

MessagesRouter.get('/', validate({ query: messagesQuerySchema }), getMessages);
MessagesRouter.get('/:messageId', validate({ params: messageIdParamsSchema }), getMessageById);

export default MessagesRouter;