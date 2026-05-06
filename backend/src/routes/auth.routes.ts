import { Router } from 'express';
import rateLimit, { type Options } from 'express-rate-limit';

import { DEFAULT_RATE_LIMIT_OPTIONS } from '@src/config/api.config.js';
import { requireAuth } from '@src/middlewares/auth.middleware.js';
import { validate } from '@src/middlewares/validation.middleware.js';

import { loginSchema, signupSchema } from '@src/schemas/auth.schemas.js';

import { login, logout, signup } from '@src/controllers/auth.controller.js';

// Helper function to add rate limits
const limit = (options?: Partial<Options>) => rateLimit({ ...DEFAULT_RATE_LIMIT_OPTIONS, ...options });

const AuthRouter: Router = Router();

// Login/Signup routes
AuthRouter.post('/login', limit({ limit: 5 }), validate({ body: loginSchema }), login);
AuthRouter.post('/logout', requireAuth, logout);
AuthRouter.post('/signup', limit({ limit: 15 }), validate({ body: signupSchema }), signup);

export default AuthRouter;