import axios from 'axios';

// Create an Axios instance with our backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Export dedicated functions for our endpoints
export const fetchCompetitors = () => API.get('/competitors');
export const createCompetitor = (competitorData) => API.post('/competitors', competitorData); // ADDED THIS LINE

export const generateSwotAnalysis = (competitorOneId, competitorTwoId) => 
  API.post('/swot/compare', { competitorOneId, competitorTwoId });