import express from 'express';
import { getCompetitors, createCompetitor } from '../controllers/competitorController.js';

const router = express.Router();

// Define routes
router.route('/').get(getCompetitors).post(createCompetitor);

export default router;