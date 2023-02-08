import axios, { AxiosResponse } from 'axios';
import env from '../env';

axios.defaults.baseURL = env.apiUrl;
axios.defaults.withCredentials = true;

const onResponseSuccess = (response: AxiosResponse) => response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onResponseError = (error: any) => {
  // if (!error.response) return notifyError();

  const status = error.response.status;
  if (status >= 500) {
    // TODO:
    // notifyError();
  }

  return Promise.reject(error);
};

axios.interceptors.response.use(onResponseSuccess, onResponseError);

export default axios;
