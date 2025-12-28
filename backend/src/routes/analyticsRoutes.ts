import { Router } from 'express';
import { getAnalyticsOverview, getAnalyticsTrends } from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/overview', auth, getAnalyticsOverview);
router.get('/trends', auth, getAnalyticsTrends);

export default router;

