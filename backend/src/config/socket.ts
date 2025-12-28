import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    // Store user socket mappings
    const userSockets = new Map<string, string>();

    io.on('connection', (socket: Socket) => {
        console.log('A user connected:', socket.id);

        // Join user-specific room when they authenticate
        socket.on('join', (userId: string) => {
            if (userId) {
                socket.join(`user:${userId}`);
                userSockets.set(userId, socket.id);
                console.log(`User ${userId} joined their room`);
            }
        });

        socket.on('disconnect', () => {
            // Remove from map when disconnected
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized. Call initializeSocket first.');
    }
    return io;
};

