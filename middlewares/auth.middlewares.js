import { JWT_SECRET } from '../configs/env.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        } 

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({ message: 'Unauthorized', error: error.message });
        next(error);
    }
};

export default authMiddleware;