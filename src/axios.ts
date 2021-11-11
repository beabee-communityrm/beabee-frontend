import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(undefined, (error) => {
  const status = error.response?.status;
  if (status === 401) {
    localStorage.setItem('isAuthenticated', 'false');
  }

  return Promise.reject(error);
});

export default axios;
