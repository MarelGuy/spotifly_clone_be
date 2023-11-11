import { Request } from "express";

class CustomError extends Error {
    constructor(public httpStatusCode: number, public statusCode: number) {

    }
}

class CustomRequest extends Request {
    header: any; constructor(public user: any);
}