import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`);
    next();
};