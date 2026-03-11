import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const signup = (data: {
  name: string;
  email: string;
  password: string;
  collegeId: number;
  leetcodeUsername: string;
}) => api.post('/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

// Users
export const getProfile = () => api.get('/users/profile');
export const getUserById = (id: number) => api.get(`/users/${id}`);

// Colleges
export const getColleges = () => api.get('/colleges');

// Leaderboard
export const getLeaderboard = (collegeId: number) =>
  api.get(`/leaderboard/${collegeId}`);

// LeetCode
export const fetchLeetcodeStats = (username: string) =>
  api.post(`/leetcode/fetch/${username}`);

export default api;
