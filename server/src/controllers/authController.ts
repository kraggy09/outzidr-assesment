
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const generateToken = (user: any) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '1d' }
    );
};

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user: any = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = generateToken(user);
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const guestLogin = async (req: Request, res: Response) => {
    try {

        const randomId = Math.random().toString(36).substring(7);
        const username = `Guest_${randomId}`;
        const email = `guest_${randomId}@example.com`;
        const password = `guest_${randomId}`;

        const user = new User({ username, email, password, role: 'Viewer' });
        await user.save();

        const token = generateToken(user);
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
