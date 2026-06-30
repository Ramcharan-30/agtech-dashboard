import axios from 'axios';

// Use the production URL if it exists, otherwise fall back to localhost for development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Export dedicated functions for our endpoints
export const fetchCompetitors = () => API.get('/competitors');
export const createCompetitor = (competitorData) => API.post('/competitors', competitorData);

export const generateSwotAnalysis = (competitorOneId, competitorTwoId) => 
  API.post('/swot/compare', { competitorOneId, competitorTwoId });