import { z } from 'zod';
import { mongooseObjectId } from '@src/utils/schema.utils.js';

// User ID schema
export const userIdParamsSchema = z.object({
  userId: mongooseObjectId,
});

export type TUserIdParams = z.infer<typeof userIdParamsSchema>;

export const updateMeBodySchema = z.object({
  fullName: z.string().nonempty(),

  course: z.string().optional(),
  year: z.string().optional(),
});

export type TUpdateMeBody = z.infer<typeof updateMeBodySchema>;
