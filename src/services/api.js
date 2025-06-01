import axios from 'axios';
// import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Додаємо токен з localStorage до кожного запиту:
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// export const login = async (username, password) => {
//   const res = await API.post('token/', { username, password });
//   return res.data;
// };

  
// //   export const register = async (username, password) => {
// //     const res = await API.post('/register/', { username, password });
// //     return res.data;
// //   };

  
// export const getFlashcards = async (includeStatuses = []) => {
//     const params = new URLSearchParams();
//     if (includeStatuses.length) {
//       includeStatuses.forEach(status => params.append('status', status));
//     }
  
//     const res = await API.get(`/flashcards/flashcards/`, { params });
//     return res.data;
//   };
  
//   export const updateProgress = async (flashcardId, status) => {
//     const res = await API.post('/flashcards/progress/', {
//       flashcard: flashcardId,
//       status: status,
//     });
//     return res.data;
//   };
  