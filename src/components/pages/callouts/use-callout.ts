import { ItemStatus } from '@beabee/beabee-common';
import { Ref, computed } from 'vue';
import { GetCalloutData } from '../../../utils/api/api.interface';
import { currentUser } from '../../../store';

export function useCallout(callout: Ref<GetCalloutData | undefined>) {
  const isOpen = computed(() => callout.value?.status === ItemStatus.Open);

  // Callout is only for members and current user isn't logged in
  const showLoginPrompt = computed(
    () =>
      isOpen.value && callout.value?.access === 'member' && !currentUser.value
  );

  // Callout is only for members and current user is not a member
  const showMemberOnlyPrompt = computed(
    () =>
      isOpen.value &&
      // !isPreview.value &&
      callout.value?.access === 'member' &&
      currentUser.value &&
      !currentUser.value.activeRoles.includes('member')
  );

  return { isOpen, showLoginPrompt, showMemberOnlyPrompt };
}
