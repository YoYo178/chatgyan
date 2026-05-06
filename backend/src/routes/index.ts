import { Router } from "express";
import AuthRouter from "./auth.routes.js";
import UsersRouter from "./user.routes.js";
import { requireAuth } from "@src/middlewares/auth.middleware.js";

const APIRouter: Router = Router();

// Auth routes, do not require any authentication
APIRouter.use('/auth', AuthRouter);

// Apply authentication middleware to all routes below this line
APIRouter.use(requireAuth);

APIRouter.use('/users', UsersRouter);

APIRouter.get('/', (_req, res) => {
    res.json({ success: true, message: 'API is working!' });
});

export default APIRouter;