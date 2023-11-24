import axios, { AxiosResponse } from 'axios';
import env from '@env';
import { addNotification } from '@store/notifications';
import i18n from './i18n';

axios.defaults.baseURL = env.apiUrl;
axios.defaults.withCredentials = true;

const onResponseSuccess = (response: AxiosResponse) => response;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onResponseError = (error: any) => {
  if (!error.response || error.response.status >= 500) {
    addNotification({
      variant: 'error',
      title: i18n.global.t(
        'notification.error',
        'Something went wrong, please try again.'
      ),
    });
  }

  return Promise.reject(error);
};

axios.interceptors.response.use(onResponseSuccess, onResponseError);

export default axios;
