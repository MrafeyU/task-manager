import express from 'express';
import type { Request, Response, Application } from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
dotenv.config();

// Global error handlers to surface uncaught errors with stacks for easier debugging
process.on('uncaughtException', (err: any) => {
    console.error('UNCAUGHT EXCEPTION -', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason: any) => {
    console.error('UNHANDLED REJECTION -', reason && reason.stack ? reason.stack : reason);
});

const app: Application = express();
const PORT = process.env.PORT || 5001;


// app.get(path,handler) -> handler taks Req & Res objs
app.get('/', (req:Request,res:Response) => {
    res.send('Server is running fine!');
}); 

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);


// Connect to DB and start server
const startServer = async() => {
    try {
        await connectDB(); // Ensure DB is connected before starting the server
        app.listen(PORT, () => {
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
