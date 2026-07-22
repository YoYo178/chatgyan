import argon2 from 'argon2';
import type { Request, Response } from 'express';

import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';

import { cookieConfig } from '@src/config/cookies.config.js';
import { tokenConfig } from '@src/config/jwt.config.js';
import { User } from '@src/models/user.model.js';
import type { TLoginBody, TSignUpBody } from '@src/schemas/auth.schemas.js';
import { createUser, getUserByEmail } from '@src/services/user.service.js';
import { APIError } from '@src/utils/api.utils.js';
import { generateAccessToken, generateRefreshToken } from '@src/utils/jwt.utils.js';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as TLoginBody;

  const user = await User.findOne({ email }).lean().exec();

  if (!user)
    throw new APIError('No user exists with the specified email.', HTTP_STATUS_CODES.NotFound);

  const passwordMatches = await argon2.verify(user.passwordHash, password);

  if (!passwordMatches) throw new APIError('Invalid password', HTTP_STATUS_CODES.BadRequest);

  const refreshToken = generateRefreshToken({
    user: { id: user._id.toString(), email: user.email },
  });
  const accessToken = generateAccessToken({
    user: { id: user._id.toString(), email: user.email, username: user.username },
  });

  res.cookie('accessToken', accessToken, {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken.expiry,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken.expiry,
  });

  // the pain to exclude a SINGLE field from an object while keeping both typescript and oxlint happy...
  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'Logged in successfully!',
    data: {
      user: {
        _id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatarURL: user.avatarURL,
        room: user.room,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie('accessToken', {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken.expiry,
  });

  res.clearCookie('refreshToken', {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken.expiry,
  });

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, message: 'Logged out successfully!' });
};

export const signup = async (req: Request, res: Response) => {
  const { username, fullName, email, password } = req.body as TSignUpBody;

  const hashedPassword = await argon2.hash(password);

  const emailExists = !!(await getUserByEmail(email));

  if (emailExists)
    throw new APIError('An account already exists with this email!', HTTP_STATUS_CODES.Conflict);

  const usernameExists = !!(await User.findOne({ username }).select('-passwordHash').lean().exec());

  if (usernameExists)
    throw new APIError('This username is already taken, try another.', HTTP_STATUS_CODES.Conflict);

  const user = await createUser({ username, fullName, email, passwordHash: hashedPassword });

  const { passwordHash: _passwordHash, ...rest } = user;

  const refreshToken = generateRefreshToken({
    user: { id: user._id.toString(), email: user.email },
  });
  const accessToken = generateAccessToken({
    user: { id: user._id.toString(), email: user.email, username: user.username },
  });

  res.cookie('accessToken', accessToken, {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken.expiry,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken.expiry,
  });

  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'User successfully registered',
    data: { user: rest },
  });
};
