import { Router } from 'express';
import { 
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    shareTask,
    getSharedTasks,
    getNotifications,
    deleteAttachment
} from '../controllers/taskController.js';
import validateTask from '../middleware/validateTask.js';
import auth from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// ROUTES
// All task routes require authentication
router.post('/', auth, validateTask, createTask);
router.get('/', auth, getAllTasks);
router.get('/shared', auth, getSharedTasks);
router.get('/notifications', auth, getNotifications);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, upload.array('attachments', 5), validateTask, updateTask);
router.put('/:id/share', auth, shareTask);
router.delete('/:id', auth, deleteTask);
router.delete('/:id/attachments/:attachmentId', auth, deleteAttachment);

export default router;