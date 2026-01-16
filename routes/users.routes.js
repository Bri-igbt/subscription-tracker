import { Router } from 'express';
import { getAllUsers, getUser } from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middlewares.js';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', authMiddleware, getUser);

export default usersRouter;