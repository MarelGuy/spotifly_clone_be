import { Request, Response, NextFunction } from "express";
import { CustomError } from "./types";

export const badRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpStatusCode === 400 || err.statusCode === 400) {
        res.status(400).send({ error: err.message || "Bad Request" });
    }
    next(err);
};

export const notFoundHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpStatusCode === 404 || err.statusCode === 404) {
        res.status(404).send({ error: err.message || "Not Found" });
    }
    next(err);
};

export const unauthorizedHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpStatusCode === 401 || err.statusCode === 401) {
        res.status(401).send({ error: err.message || "Unauthorized" });
    }
    next(err);
};

export const forbiddenHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (err.httpStatusCode === 403 || err.statusCode === 403) {
        res.status(403).send({ error: err.message || "Forbidden" });
    }
    next(err);
};

export const catchAllHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (!res.headersSent) {
        console.log(err);
        res
            .status(err.httpStatusCode || 500)
            .send({ error: err.message || "Generic Server Error" });
    }
};