import Competitor from '../models/Competitor.js';

// @desc    Generate a comparative SWOT analysis between two competitors
// @route   POST /api/swot/compare
// @access  Public
export const generateComparativeSWOT = async (req, res) => {
  try {
    const { competitorOneId, competitorTwoId } = req.body;

    if (!competitorOneId || !competitorTwoId) {
      return res.status(400).json({ message: 'Please provide exactly two competitor IDs for comparison.' });
    }

    const comp1 = await Competitor.findById(competitorOneId);
    const comp2 = await Competitor.findById(competitorTwoId);

    if (!comp1 || !comp2) {
      return res.status(404).json({ message: 'One or both competitors could not be found in the database.' });
    }

    // --- Rule-Based Comparative Engine ---
    // We analyze both teams simultaneously to generate actionable strategic insights.

    const analysis = {
      targetCompanies: [comp1.name, comp2.name],
      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: []
      }
    };

    // 1. Market Share & Revenue Comparison (Strengths & Weaknesses)
    if (comp1.marketShare > comp2.marketShare) {
      analysis.swot.strengths.push(`${comp1.name} holds a dominant market share (${comp1.marketShare}%) compared to ${comp2.name} (${comp2.marketShare}%).`);
      analysis.swot.weaknesses.push(`${comp2.name} faces a steep barrier to entry against ${comp1.name}'s established market presence.`);
    } else if (comp2.marketShare > comp1.marketShare) {
      analysis.swot.strengths.push(`${comp2.name} holds a dominant market share (${comp2.marketShare}%) compared to ${comp1.name} (${comp1.marketShare}%).`);
      analysis.swot.weaknesses.push(`${comp1.name} faces a steep barrier to entry against ${comp2.name}'s established market presence.`);
    }

    if (comp1.revenue > comp2.revenue) {
      analysis.swot.strengths.push(`${comp1.name} possesses superior capital with $${comp1.revenue}M in revenue, allowing for aggressive R&D scaling.`);
    } else {
       analysis.swot.strengths.push(`${comp2.name} possesses superior capital with $${comp2.revenue}M in revenue, allowing for aggressive R&D scaling.`);
    }

    // 2. Tech Stack Differentiation (Opportunities)
    const comp1UniqueTech = comp1.techStack.filter(tech => !comp2.techStack.includes(tech));
    const comp2UniqueTech = comp2.techStack.filter(tech => !comp1.techStack.includes(tech));

    if (comp1UniqueTech.length > 0) {
      analysis.swot.opportunities.push(`${comp1.name} can heavily market its proprietary advantages in [${comp1UniqueTech.join(', ')}] to capture niche segments.`);
    }
    if (comp2UniqueTech.length > 0) {
      analysis.swot.opportunities.push(`${comp2.name} can heavily market its proprietary advantages in [${comp2UniqueTech.join(', ')}] to capture niche segments.`);
    }

    // 3. Grassroots Adoption (Threats)
    if (comp1.adoptionMetrics.activeFarmers < comp2.adoptionMetrics.activeFarmers) {
      analysis.swot.threats.push(`${comp1.name} risks losing ground-level AgTech influence as ${comp2.name} commands a larger active farmer base.`);
    } else {
      analysis.swot.threats.push(`${comp2.name} risks losing ground-level AgTech influence as ${comp1.name} commands a larger active farmer base.`);
    }

    res.status(200).json(analysis);

  } catch (error) {
    res.status(500).json({ message: 'Error generating comparative analysis', error: error.message });
  }
};