// logic layer that handles requests and responses.
// Controllers define what happens when someone calls that path.

import type { Request, Response } from 'express';
import Task from '../models/taskModel.js'; 

// Build CREATE TASK controller(POST/tasks):
const createTask = async (req: Request & { user?: any }, res: Response) => {
    try { 
        const payload = { ...req.body, user: req.user?.id };
        const task = await Task.create(payload);
        res.status(201).json(task);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to create task', details: error });
    }
};


// Build GET ALL TASKS controller(GET/tasks):

const getAllTasks = async (req: Request & { user?: any }, res: Response) => {
    try {
        // return tasks belonging to authenticated user if available
        const filter: any = {};
        if (req.user?.id) filter.user = req.user.id;
        const tasks = await Task.find(filter);
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch all the tasks', details: error });
    }
};


// Build GET SINGLE TASK controller(GET/tasks/:id):
const getTaskById = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {   
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Opps.. Task not found' });
        }
        // ensure ownership
        if (task.user && String(task.user) !== String(req.user?.id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.status(200).json(task);
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to fetch task', details: error });
    }
}

// Build UPDATE TASK controller(PUT/tasks/:id):
const updateTask = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
         // find & update
        const existing = await Task.findById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Opps.. Task not found' });
        if (existing.user && String(existing.user) !== String(req.user?.id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
         // if not found → 404
        if (!task) {
            return res.status(404).json({ error: 'Opps.. Task not found' });
        }
        // else → 200 with updated task
        res.status(200).json(task);
        
    } catch (error) {
        // 400 with error message
        res.status(400).json({ error: 'Failed to update task', details: error });
    }
};

// Build DELETE TASK controller(DELETE/tasks/:id):
const deleteTask = async (req: Request & { user?: any }, res: Response): Promise<any> => {
    try {
        const existing = await Task.findById(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Opps.. Task not found' });
        if (existing.user && String(existing.user) !== String(req.user?.id)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully', deletedTask: task  });
    } catch (error: any) {
        res.status(400).json({ error: 'Failed to delete task', details: error });
    }
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };

// A controller is a function that handles incoming requests to a specific route or endpoint in a web application. It acts as an intermediary between the client (such as a web browser or mobile app) and the server-side logic or database. Controllers are responsible for processing the request, performing any necessary operations (such as querying a database, validating data, or applying business logic), and then sending an appropriate response back to the client.

// In the context of a RESTful API, controllers typically correspond to specific HTTP methods (GET, POST, PUT, DELETE) and endpoints (URLs) that define the actions that can be performed on resources. For example, in a task management application, you might have controllers for creating tasks, retrieving tasks, updating tasks, and deleting tasks. Each controller function would handle the logic for its respective operation and return the relevant data or status codes to the client.