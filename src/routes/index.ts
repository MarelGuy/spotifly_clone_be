import { Router } from "express";
import userRouter from './users/index.js';

const app: Router = Router();

app.use("/user", userRouter);

export default app;