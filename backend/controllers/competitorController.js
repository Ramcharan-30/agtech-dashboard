import Competitor from '../models/Competitor.js';

// @desc    Get all competitors
// @route   GET /api/competitors
// @access  Public
export const getCompetitors = async (req, res) => {
  try {
    const competitors = await Competitor.find({});
    res.status(200).json(competitors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Unable to fetch competitors', error: error.message });
  }
};

// @desc    Create a new competitor
// @route   POST /api/competitors
// @access  Public
export const createCompetitor = async (req, res) => {
  try {
    const { name, description, marketShare, revenue, businessModel, adoptionMetrics, techStack } = req.body;

    // Check if competitor already exists
    const competitorExists = await Competitor.findOne({ name });
    if (competitorExists) {
      return res.status(400).json({ message: 'Competitor already exists' });
    }

    const competitor = await Competitor.create({
      name,
      description,
      marketShare,
      revenue,
      businessModel,
      adoptionMetrics,
      techStack,
    });

    res.status(201).json(competitor);
  } catch (error) {
    res.status(400).json({ message: 'Invalid competitor data', error: error.message });
  }
};