import axios from 'axios';

const API = axios.create({ baseURL: 'https://daily-deck.onrender.com/'
 });
// const API = axios.create({ baseURL: 'http://localhost:5000'
//  });
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

// Auth
export const login = (formData: any) => API.post('/api/auth/login', formData);
export const register = (formData: any) => API.post('/api/auth/register', formData);
export const getProfile = () => API.get('/api/auth/profile');

// Quiz
export const generateQuiz = (config: any) => API.post('/api/quiz/generate', config);
export const submitQuiz = (data: any) => API.post('/api/quiz/submit', data);
export const getLatestQuiz = () => API.get('/api/quiz/latest');