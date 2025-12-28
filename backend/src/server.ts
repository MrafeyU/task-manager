import express from 'express';
import type { Request, Response, Application } from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import cors from 'cors';
import { createServer } from 'http';
import { initializeSocket } from './config/socket.js';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

// Global error handlers to surface uncaught errors with stacks for easier debugging
process.on('uncaughtException', (err: any) => {
    console.error('UNCAUGHT EXCEPTION -', err);
    if (err && err.stack) {
        console.error('Stack:', err.stack);
    }
    if (err && err.message) {
        console.error('Message:', err.message);
    }
    console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('UNHANDLED REJECTION at:', promise);
    console.error('Reason:', reason);
    if (reason && reason.stack) {
        console.error('Stack:', reason.stack);
    }
    if (reason && reason.message) {
        console.error('Message:', reason.message);
    }
});

const app: Application = express();
const PORT = process.env.PORT || 8000;

// app.get(path,handler) -> handler taks Req & Res objs
app.get('/', (req:Request,res:Response) => {
    res.send('Server is running fine!');
}); 

// Middlewares
app.use(cors());
app.use(express.json());
// Serve uploaded files (only if directory exists)
if (existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

const httpServer = createServer(app);
initializeSocket(httpServer);

// Connect to DB and start server
const startServer = async() => {
    try {
        await connectDB(); // Ensure DB is connected before starting the server
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        // Log error with stack if available and avoid a silent crash.
        console.error('Failed to start server:', err instanceof Error ? err.stack || err.message : err);
        // We don't call process.exit here — nodemon will stay up and you can fix and save files.
    }
};

// Start the server
startServer();
