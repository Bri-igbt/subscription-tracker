import { Router } from 'express';

const authRouter = Router();

authRouter.post('/login', (req, res) => {
    res.send('Login endpoint');
});

export default authRouter;