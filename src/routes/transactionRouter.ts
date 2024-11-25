import express from 'express';
import { buyShares, getTransactionLogsForTeam } from '../controllers/transactionController';

const router = express.Router();

// Buy shares from another team
router.post('/buy', buyShares);

// Get transaction logs for a specific team
router.get('/logs/:id', getTransactionLogsForTeam);

export default router;
