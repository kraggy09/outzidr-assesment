import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cardRoutes from './routes/cards';
import authRoutes from './routes/auth';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/kanban')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.set("io", io);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Kanban Server Running');
});

httpServer.listen(port, () => {
    console.log(`[server]: Server is running at ${port}`);
});
