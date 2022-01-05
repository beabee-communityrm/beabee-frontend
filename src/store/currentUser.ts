import axios from '../axios';
import { ref } from 'vue';
import { Role } from '../utils/enums/roles.enum';

interface Member {
  roles: Role[];
}

async function updateCurrentUser(): Promise<void> {
  try {
    const resp = await axios.get('/member/me');
    currentUser.value = resp.data as Member;
  } catch (err) {
    currentUser.value = null;
  }
}

const currentUser = ref<Member | null>(null);
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
