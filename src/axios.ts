import axios, { AxiosResponse } from 'axios';
import { notifyError } from './plugins/notify';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

const onResponseSuccess = (response: AxiosResponse) => response;

const onResponseError = (error: any) => {
  if (!error.response) return notifyError();

  const status = error.response.status;
  if (status >= 500) {
    notifyError();
  }

  return Promise.reject(error);
};

axios.interceptors.response.use(onResponseSuccess, onResponseError);

export default axios;
