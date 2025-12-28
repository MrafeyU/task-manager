// logic layer that handles requests and responses.
// Controllers define what happens when someone calls that path.

import type { Request, Response } from 'express';
import Task from '../models/taskModel.js'; 
import User from '../models/userModel.js';
import { getIO } from '../config/socket.js';
import path from 'path';
import { unlinkSync } from 'fs';

// Build CREATE TASK controller(POST/tasks):
const createTask = async (req: Request & { user?: any }, res: Response) => {
    try { 
        // Ensure the authenticated user becomes the owner
        const payload = { ...req.body, owner: req.user?.id, user: req.user?.id };
        const task = await Task.create(payload);
        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to create task', details: error });
    }
};


// Build GET ALL TASKS controller(GET/tasks):

const getAllTasks = async (req: Request & { user?: any }, res: Response) => {
    try {
        // return tasks owned by the user OR shared with the user
        const userId = req.user?.id;
        const tasks = await Task.find({
            $or: [
                { owner: userId },
                { sharedWith: userId }
            ]
        }).populate('owner', 'name email').populate('sharedWith', 'name email');
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch all the tasks', details: error });
    }
};


// Build GET SINGLE TASK controller(GET/tasks/:id):
const getTaskById = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {   
        const task = await Task.findById(req.params.id).populate('owner', 'name email').populate('sharedWith', 'name email');
        if (!task) {
            return res.status(404).json({ error: 'Opps.. Task not found' });
        }
        // allow access if owner or sharedWith contains the user
        const requester = String(req.user?.id || '');
        const ownerId = task.owner ? String(task.owner) : (task.user ? String(task.user) : null);
        const isOwner = ownerId === requester;
        
        let isShared = false;
        if (Array.isArray((task as any).sharedWith) && (task as any).sharedWith.length > 0) {
            isShared = (task as any).sharedWith.some((userId: any) => {
                const userIdStr = userId?._id ? String(userId._id) : (userId ? String(userId) : '');
                return userIdStr === requester;
            });
        }
        
        if (!isOwner && !isShared) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.status(200).json(task);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch task', details: error });
    }
}

// Build UPDATE TASK controller(PUT/tasks/:id):
const updateTask = async (req: Request & { user?: any, files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } }, res: Response): Promise<any> => {
    try {
         // find & update
        const existing = await Task.findById(req.params.id).populate('owner sharedWith');
        if (!existing) return res.status(404).json({ error: 'Opps.. Task not found' });
        
        // owner or users with shared access can update
        const requester = String(req.user?.id || '');
        
        // Check if user is owner - handle both populated and unpopulated
        const ownerId = existing.owner 
            ? String((existing.owner as any)._id || existing.owner) 
            : (existing.user ? String(existing.user) : null);
        const isOwner = ownerId === requester;
        
        // Check if user is in sharedWith array - handle both populated and unpopulated ObjectIds
        let isShared = false;
        const sharedWith = (existing as any).sharedWith || [];
        if (Array.isArray(sharedWith) && sharedWith.length > 0) {
            isShared = sharedWith.some((userId: any) => {
                // Handle populated user object
                if (userId && typeof userId === 'object' && userId._id) {
                    return String(userId._id) === requester;
                }
                // Handle unpopulated ObjectId
                return String(userId) === requester;
            });
        }
        
        if (!isOwner && !isShared) {
            console.log('Update forbidden:', { 
                requester, 
                ownerId, 
                isOwner, 
                isShared, 
                sharedWith: sharedWith.map((u: any) => ({ 
                    raw: u, 
                    string: String(u?._id || u),
                    type: typeof u
                }))
            });
            return res.status(403).json({ error: 'Forbidden: You do not have permission to edit this task' });
        }
        
        const updateData: any = { ...req.body };
        
        // Handle file uploads
        const files = Array.isArray(req.files) ? req.files : (req.files ? Object.values(req.files).flat() : []);
        if (files.length > 0) {
            const newAttachments = files.map((file: Express.Multer.File) => ({
                filename: file.filename,
                originalName: file.originalname,
                path: `/uploads/${file.filename}`,
                size: file.size,
                mimetype: file.mimetype,
                uploadedAt: new Date()
            }));
            
            const currentAttachments = (existing as any).attachments || [];
            updateData.attachments = [...currentAttachments, ...newAttachments];
        }
        
        const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
         // if not found → 404
        if (!task) {
            return res.status(404).json({ error: 'Opps.. Task not found' });
        }
        
        // Notify shared users about status update
        if (req.body.status && Array.isArray((task as any).sharedWith)) {
            const message = `Task "${task.title}" status updated to ${req.body.status}.`;
            const io = getIO();
            (task as any).sharedWith.forEach((uid: any) => {
                const userId = String(uid);
                User.updateOne({ _id: userId }, { $push: { notifications: { message, date: new Date() } } }).exec();
                io.to(`user:${userId}`).emit('notification', { message, date: new Date(), type: 'task_updated' });
            });
        }
        
        // else → 200 with updated task
        res.status(200).json(task);
        
    } catch (error) {
        // 400 with error message
        res.status(400).json({ error: 'Failed to update task', details: error });
    }
};

// Build DELETE ATTACHMENT controller(DELETE/tasks/:id/attachments/:attachmentId):
const deleteAttachment = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        
        const requester = String(req.user?.id || '');
        const isOwner = task.owner ? String(task.owner) === requester : (task.user ? String(task.user) === requester : false);
        if (!isOwner) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        const attachments = (task as any).attachments || [];
        const attachment = attachments.find((a: any) => String(a._id) === req.params.attachmentId);
        
        if (!attachment) {
            return res.status(404).json({ error: 'Attachment not found' });
        }
        
        // Delete file from filesystem
        try {
            const filePath = path.join(process.cwd(), 'uploads', attachment.filename);
            unlinkSync(filePath);
        } catch (err) {
            console.error('Error deleting file:', err);
        }
        
        // Remove attachment from task
        (task as any).attachments = attachments.filter((a: any) => String(a._id) !== req.params.attachmentId);
        await task.save();
        
        res.status(200).json({ message: 'Attachment deleted successfully', task });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to delete attachment', details: error });
    }
};

// Build DELETE TASK controller(DELETE/tasks/:id):
const deleteTask = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const existing = await Task.findById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Opps.. Task not found' });
        // only owner can delete
        const requester = String(req.user?.id || '');
        const isOwner = existing.owner ? String(existing.owner) === requester : (existing.user ? String(existing.user) === requester : false);
        if (!isOwner) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully', deletedTask: task  });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to delete task', details: error });
    }
};

// Build SHARE TASK controller(PUT/tasks/:id/share):
const shareTask = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { sharedWith } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Ensure ownership
        const requester = String(req.user?.id || '');
        const isOwner = task.owner ? String(task.owner) === requester : (task.user ? String(task.user) === requester : false);
        if (!isOwner) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Backfill owner for legacy tasks created before collaboration fields
        if (!(task as any).owner) {
            (task as any).owner = (task as any).user || req.user?.id;
        }

        // Validate payload
        const ids = Array.isArray(sharedWith) ? sharedWith.map(String).filter(Boolean) : [];
        // Update sharedWith field (dedupe)
        const current = Array.isArray((task as any).sharedWith) ? (task as any).sharedWith.map(String) : [];
        const merged = Array.from(new Set([...current, ...ids]));
        (task as any).sharedWith = merged;
        await task.save();

        // Persist notifications to recipient users and emit Socket.IO events
        if (merged.length) {
            const message = `A task "${task.title}" was shared with you.`;
            const io = getIO();
            await Promise.all(ids.map(async (uid: string) => {
                await User.updateOne({ _id: uid }, { $push: { notifications: { message, date: new Date() } } }).exec();
                // Emit real-time notification
                io.to(`user:${uid}`).emit('notification', { message, date: new Date(), type: 'task_shared' });
            }));
        }

        res.status(200).json({ message: 'Task shared successfully', task });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to share task', details: error });
    }
};

// Build GET SHARED TASKS controller(GET/tasks/shared):
const getSharedTasks = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const tasks = await Task.find({ sharedWith: req.user?.id });
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch shared tasks', details: error });
    }
};

// Build GET NOTIFICATIONS controller(GET/notifications):
const getNotifications = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user.notifications);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch notifications', details: error });
    }
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask, shareTask, getSharedTasks, getNotifications, deleteAttachment };

// A controller is a function that handles incoming requests to a specific route or endpoint in a web application. It acts as an intermediary between the client (such as a web browser or mobile app) and the server-side logic or database. Controllers are responsible for processing the request, performing any necessary operations (such as querying a database, validating data, or applying business logic), and then sending an appropriate response back to the client.

// In the context of a RESTful API, controllers typically correspond to specific HTTP methods (GET, POST, PUT, DELETE) and endpoints (URLs) that define the actions that can be performed on resources. For example, in a task management application, you might have controllers for creating tasks, retrieving tasks, updating tasks, and deleting tasks. Each controller function would handle the logic for its respective operation and return the relevant data or status codes to the client.