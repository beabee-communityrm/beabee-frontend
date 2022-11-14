import { PermissionType } from '@beabee/beabee-common';
import { computed, ComputedRef } from 'vue';
import { currentUser } from '../store';

const currentUserCan = (role: PermissionType): ComputedRef<boolean> => {
  return computed(() => {
    return (
      currentUser.value != null && currentUser.value.activeRoles.includes(role)
    );
  });
};

export default currentUserCan;

export const canAdmin = currentUserCan('admin');
