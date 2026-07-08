import axios from 'axios';

// Use the production URL if it exists, otherwise fall back to localhost for development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor — attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agtech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401s by clearing auth state
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear if we're not already on the auth pages
      const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthRoute) {
        localStorage.removeItem('agtech_token');
        localStorage.removeItem('agtech_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth Endpoints ───
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const googleAuthUser = (credential) => API.post('/auth/google', { credential });
export const getMe = () => API.get('/auth/me');
export const updateUser = (userData) => API.put('/auth/me', userData);

// ─── Data Endpoints ───
export const fetchCompetitors = () => API.get('/competitors');
export const createCompetitor = (competitorData) => API.post('/competitors', competitorData);
export const updateCompetitor = (id, competitorData) => API.put(`/competitors/${id}`, competitorData);
export const deleteCompetitor = (id) => API.delete(`/competitors/${id}`);

export const generateSwotAnalysis = (competitorOneId, competitorTwoId) =>
  API.post('/swot/compare', { competitorOneId, competitorTwoId });