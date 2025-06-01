import API from './api';

export const login = async (username, password) => {
  const res = await API.post('/token/', { username, password });
  if (res.data.access) {
    localStorage.setItem('token', res.data.access);
  }
  return res.data;
};

// export const register = async (username, password) => {
//   const res = await API.post('/register/', { username, password });
//   return res.data;
// };
export default API;