import { computed, ComputedRef } from 'vue';
import { currentUser } from '../store';
import { Role } from './enums/roles.enum';

const currentUserCan = (role: Role): ComputedRef<boolean> => {
  return computed(() => {
    return currentUser.value != null && currentUser.value.roles.includes(role);
  });
};

export default currentUserCan;

export const canAdmin = currentUserCan(Role.Admin);
