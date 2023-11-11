import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).send('Access denied.');

    jwt.verify(token, process.env.JWT_SECRET!, (err, user: any) => {
        if (err) return res.status(403).send('Invalid token.');

        req.user = user;
        next();
    });
};