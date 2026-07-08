import express from 'express';
import { getCompetitors, createCompetitor, updateCompetitor, deleteCompetitor } from '../controllers/competitorController.js';

const router = express.Router();

// Define routes
router.route('/').get(getCompetitors).post(createCompetitor);
router.route('/:id').put(updateCompetitor).delete(deleteCompetitor);

export default router;