import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import ebookRoutes from './routes/ebookRoutes.js';
import freeResourceRoutes from './routes/freeResourceRoutes.js';
import guidedAudioRoutes from './routes/guidedAudioRoutes.js';
import path from 'path';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/freeresources', freeResourceRoutes);
app.use('/api/guidedaudios', guidedAudioRoutes);

// Statically serve uploads folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*', // In production, replace with frontend URL (ex. http://localhost:5173)
        methods: ['GET', 'POST']
    }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
    socket.on('register_user', (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            // Broadcast the updated list of online users to all connected clients
            io.emit('online_users', Array.from(onlineUsers.keys()));
        }
    });

    socket.on('disconnect', () => {
        let disconnectedUserId = null;
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                disconnectedUserId = userId;
                break;
            }
        }
        if (disconnectedUserId) {
            onlineUsers.delete(disconnectedUserId);
            io.emit('online_users', Array.from(onlineUsers.keys()));
        }
    });
});
