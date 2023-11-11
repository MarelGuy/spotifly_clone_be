import { hash } from 'bcrypt';
import { Router, NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import userModel from '../../schemas/userModel.js';
import { authenticateToken } from '../../middlewares/auth.js';

const app: Router = Router();

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.find();

        res.status(200).send(user);
    } catch (err: unknown) {
        console.log(err);
        next(err);
    }
});

app.get('/test_protection', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send('This is a protected route.');
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.get('/:nickname', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userModel.find({ "nickname": req.params.nickname });

        res.status(200).send(user);
    } catch (err: unknown) {
        console.log(err);
        next(err);
    }
});



app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { nickname, password, email, role } = req.body;

    try {
        const user = new userModel({ nickname, password, email, role });
        let { _id } = await user.save();

        res.status(201).send(_id);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {

        let { email, password } = req.body;

        const user = await userModel.findByCredentials(email, password);

        if (!user) return res.status(401).send('Invalid credentials.');

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!);
        res.json({ token });
    } catch (err) {
        console.log(err);
        next(err);
    }
});



export default app;