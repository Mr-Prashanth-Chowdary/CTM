import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import APIError from '../errors/APIError';

const SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const authenticateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new APIError('AUTH_MISSING', 'Authorization token is required');
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, SECRET);

        // Inject user_id into req.body
        req.body.userId = decoded.user_id;

        next();
    } catch (error: any) {
        console.error(error);
        return res.status(401).json({
            error: 'INVALID_TOKEN',
            message: error.message || 'Unauthorized',
        });
    }
};
