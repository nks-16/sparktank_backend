import express from 'express';
import { getTeamById } from '../controllers/teamController';
import { createTeam } from '../controllers/teamController';


const router = express.Router();

// Get team by ID
router.get('/:id', getTeamById);
router.post('/', createTeam);

export default router;
