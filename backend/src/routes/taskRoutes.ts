import { Router } from 'express';
import { 
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import validateTask from '../middleware/validateTask.js';
import auth from '../middleware/auth.js';

const router = Router();

// ROUTES
// All task routes require authentication
router.post('/', auth, validateTask, createTask);
router.get('/', auth, getAllTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, validateTask, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;