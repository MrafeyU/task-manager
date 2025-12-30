import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/health
// Returns overall service health and DB connection state
router.get('/', (_req, res) => {
  const state = mongoose.connection.readyState; // 0 disconnected,1 connected,2 connecting,3 disconnecting
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const dbStatus = states[state] ?? 'unknown';
  const ok = state === 1;
  res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'error', db: dbStatus });
});

export default router;
