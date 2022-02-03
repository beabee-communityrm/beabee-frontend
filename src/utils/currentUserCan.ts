import { computed, ComputedRef } from 'vue';
import { currentUser } from '../store';
import { PermissionType } from './api/api.interface';

const currentUserCan = (role: PermissionType): ComputedRef<boolean> => {
  return computed(() => {
    return currentUser.value != null && currentUser.value.roles.includes(role);
  });
};

export default currentUserCan;

export const canAdmin = currentUserCan('admin');
