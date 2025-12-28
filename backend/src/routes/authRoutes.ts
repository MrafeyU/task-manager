import { Router } from 'express';
import { register, login, listUsers } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', auth, listUsers);

export default router;
