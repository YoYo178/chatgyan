import { Router } from "express";
const APIRouter: Router = Router();

APIRouter.get('/', (_req, res) => {
    res.json({ message: 'Hello world' });
});

export default APIRouter;