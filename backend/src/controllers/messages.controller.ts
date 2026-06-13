import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import { Message } from '@src/models/message.model.js';
import type {
  TMessagesQuery,
  TMessageIdParams,
} from '@src/schemas/messages.schema.js';
import { APIError } from '@src/utils/api.utils.js';
import type { Request, Response } from 'express';

const MESSAGES_PER_PAGE = 20;

export const getMessages = async (req: Request, res: Response) => {
  const { roomId, before, after } = req.query as unknown as TMessagesQuery;

  const query: { _id?: { $lt: string } | { $gt: string }; room: string } = {
    room: roomId,
  };

  if (before) query._id = { $lt: before };

  if (after) query._id = { $gt: after };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 }) // Fetch in Descending order (newest to oldest)
    .lean()
    .exec();

  const moreMessagesExist = messages.length > MESSAGES_PER_PAGE;
  const sliced = moreMessagesExist
    ? messages.slice(0, MESSAGES_PER_PAGE)
    : messages;

  // Sort this specific batch in ascending order (oldest to newest) before returning
  sliced.reverse();

  res.status(200).json({
    success: true,
    data: {
      messages: sliced,
      nextCursor: moreMessagesExist ? sliced[0]?._id : null,
    },
  });
};

export const getMessageById = async (req: Request, res: Response) => {
  const { messageId } = req.params as TMessageIdParams;

  const message = await Message.findById(messageId);

  if (!message)
    throw new APIError('Message not found', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { message } });
};
