import { RoleType } from '@beabee/beabee-common';
import { computed, ComputedRef } from 'vue';
import { currentUser } from '../store';

const currentUserCan = (role: RoleType): ComputedRef<boolean> => {
  return computed(() => {
    return (
      currentUser.value != null && currentUser.value.activeRoles.includes(role)
    );
  });
};

export default currentUserCan;

export const canAdmin = currentUserCan('admin');
