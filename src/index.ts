import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from 'mongoose';


import {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    badRequestHandler,
    catchAllHandler,
} from './errorHandler.js';

import routes from "./routes/index.js";
import { loggerMiddleware } from './middlewares/logger.js';

dotenv.config();

const app: Express = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
};

const port: string | undefined = process.env.PORT;

// Middlewares

app.use(express.json());
app.use(cors(corsOptions));
app.use(loggerMiddleware);

// All routes

app.use("/", routes);

// Error handlers TODO: fix

app.use(unauthorizedHandler);
app.use(forbiddenHandler);
app.use(notFoundHandler);
app.use(badRequestHandler);
app.use(catchAllHandler);

app.listen(port, async () => {
    await connect(process.env.MONGODB_URL!).then(() => console.log("🛢️  [database] : Connected to MongoDB"));
    console.log(`⚡️   [server] : Server is running at http://localhost:${port}`);
});
