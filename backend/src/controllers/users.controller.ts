import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import { User } from '@src/models/user.model.js';
import type { TUpdateMeBody, TUserIdParams } from '@src/schemas/user.schemas.js';
import { APIError } from '@src/utils/api.utils.js';
import type { Request, Response } from 'express';

export const getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user.id).select('-passwordHash').lean().exec();

    if (!user)
        throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

    res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { user } });
};

export const updateMe = async (req: Request, res: Response) => {
    const { fullName, course, year } = req.body as TUpdateMeBody;

    const user = await User.findById(req.user.id).select('-passwordHash').exec();

    if (!user)
        throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

    user.fullName = fullName ?? user.fullName;
    user.course = course ?? user.course;
    user.year = year ?? user.year;

    await user.save();

    res.status(HTTP_STATUS_CODES.Ok).json({ success: true, message: 'Updated user successfully', data: { user } });
};

export const getUser = async (req: Request, res: Response) => {
    const { userId } = req.params as TUserIdParams;
    const user = await User.findById(userId)
        .select(`
            -passwordHash
            -fullName
            -email
            -room
            -updatedAt
        `)
        .lean()
        .exec();

    if (!user)
        throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

    res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { user } });
};