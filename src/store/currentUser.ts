import { RoleType } from '@beabee/beabee-common';
import { computed, ComputedRef, ref } from 'vue';
import axios from '../lib/axios';
import { fetchContact } from '../utils/api/contact';
import { GetContactData } from '../utils/api/api.interface';

export async function updateCurrentUser(
  contact?: GetContactData
): Promise<void> {
  try {
    currentUser.value = contact || (await fetchContact('me'));
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

export const currentUserCan = (role: RoleType): ComputedRef<boolean> => {
  return computed(() => {
    return (
      currentUser.value != null && currentUser.value.activeRoles.includes(role)
    );
  });
};

export const canAdmin = currentUserCan('admin');
