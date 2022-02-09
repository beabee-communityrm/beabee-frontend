import axios from '../axios';
import { ref } from 'vue';
import { fetchMember } from '../utils/api/member';
import { GetMemberData } from '../utils/api/api.interface';

export async function updateCurrentUser(): Promise<void> {
  try {
    currentUser.value = await fetchMember();
  } catch (err) {
    currentUser.value = null;
  }
}

export const currentUser = ref<GetMemberData | null>(null);
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
