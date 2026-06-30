import express from 'express';
import { generateComparativeSWOT } from '../controllers/swotController.js';

const router = express.Router();

// Define route for generating SWOT
router.route('/compare').post(generateComparativeSWOT);

export default router;