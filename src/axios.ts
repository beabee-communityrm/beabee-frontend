import axios, { AxiosResponse } from 'axios';
import { notifyError } from './plugins/notify';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

const onResponseSuccess = (response: AxiosResponse) => response;

const onResponseError = (error: any) => {
  if (!error.response) return notifyError();

  const status = error.response.status;

  // - TODO: if we receive more precise erros form
  // API response we can show more precise erros-
  if (status === 401) {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('user');
  } else if (status >= 500) {
    notifyError();
  }

  return Promise.reject(error);
};

axios.interceptors.response.use(onResponseSuccess, onResponseError);

export default axios;
