import axios from '../axios';
import { ref } from 'vue';
import { fetchContact } from '../utils/api/contact';
import { GetContactData } from '../utils/api/api.interface';

export async function updateCurrentUser(): Promise<void> {
  try {
    currentUser.value = await fetchContact('me');
  } catch (err) {
    currentUser.value = null;
  }
}

export const currentUser = ref<GetContactData | null>(null);
export const initCurrentUser = updateCurrentUser();

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      currentUser.value = null;
    }
    return Promise.reject(error);
  }
);
