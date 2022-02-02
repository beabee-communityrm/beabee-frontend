import axios from '../axios';
import { ref } from 'vue';
import { fetchMember } from '../utils/api/member';
import { GetMemberData } from '../utils/api/api.interface';

async function updateCurrentUser(): Promise<void> {
  try {
    currentUser.value = await fetchMember('me');
  } catch (err) {
    currentUser.value = null;
  }
}

const currentUser = ref<GetMemberData | null>(null);
const initialUserPromise = updateCurrentUser();

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      currentUser.value = null;
    }
    return Promise.reject(error);
  }
);

export { currentUser, initialUserPromise, updateCurrentUser };
