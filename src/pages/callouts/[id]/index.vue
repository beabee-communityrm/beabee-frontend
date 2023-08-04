<route lang="yaml">
name: callout
meta:
  pageTitle: menu.callouts
  noAuth: true
</route>

<template>
  <div v-if="callout" class="md:max-w-2xl">
    <h1 class="mb-6 font-title text-4xl font-bold">{{ callout.title }}</h1>
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center text-sm font-semibold text-body-60">
        <div>
          <ItemStatusText :item="callout" />
        </div>
        <div
          v-if="latestResponse"
          class="border-body-40 ml-3 w-32 border-l pl-3"
        >
          {{ t('callout.youResponded') }}
        </div>
      </div>
      <AppButton
        v-if="callout.status === ItemStatus.Open"
        :icon="showSharingPanel ? faCaretDown : faShare"
        variant="primaryOutlined"
        @click="showSharingPanel = !showSharingPanel"
        >{{ t('common.share') }}</AppButton
      >
    </div>

    <transition-group name="slide">
      <SharingPanel v-if="showSharingPanel" :slug="callout.slug" />
    </transition-group>

    <div
      v-show="latestResponse || showOnlyThankYou"
      class="mb-6 flex rounded bg-white p-6 text-lg text-success"
    >
      <div class="flex-0 mr-4 text-2xl">
        <font-awesome-icon :icon="faThumbsUp" />
      </div>
      <div>
        <h3 class="font-semibold">
          {{ callout.thanksTitle }}
        </h3>
        <div
          class="content-message font-normal text-body-80"
          v-html="callout.thanksText"
        />
      </div>
    </div>

    <figure class="mb-6">
      <img class="w-full object-cover" :src="callout.image" />
    </figure>

    <div class="content-message mb-6 text-lg" v-html="callout.intro" />

    <div v-if="showLoginPrompt" class="my-12">
      <p class="text-center">
        {{ t('callout.membersOnly') }}
      </p>
      <div class="mt-6 flex flex-col gap-4 sm:flex-row">
        <AppButton class="w-full" variant="link" to="/join">
          {{ t('callout.joinNow') }}
        </AppButton>
        <AppButton class="w-full" variant="linkOutlined" to="/auth/login">
          {{ t('callout.loginToYourAccount') }}
        </AppButton>
      </div>
    </div>

    <div v-if="showMemberOnlyPrompt" class="my-12 text-center">
      <p>
        {{ t('callout.membersOnly') }}
        <b>{{ t('callout.updateContribution') }}</b>
      </p>
      <AppButton
        class="mt-4 w-full sm:w-1/2"
        variant="link"
        to="/profile/contribution"
      >
        {{ t('callout.toContributionPage') }}
      </AppButton>
    </div>

    <template v-if="!showOnlyThankYou">
      <hr class="mt-10 border-t border-primary-40 pt-10" />

      <AppNotification
        v-if="isPreview"
        variant="warning"
        :title="t('callout.showingPreview')"
        class="mb-4"
      />
      <AppNotification
        v-else-if="!isOpen"
        variant="info"
        :title="t('callout.closed')"
        class="mb-4"
      />

      <CalloutForm
        v-if="
          showResponseForm &&
          responses /* Form.IO doesn't handle reactivity so wait for responses to load */
        "
        :callout="callout"
        :response="latestResponse"
        :preview="isPreview"
        @submitted="handleSubmitResponse"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { Paginated, ItemStatus } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../../utils/api/callout';
import AppButton from '../../../components/button/AppButton.vue';
import { currentUser, canAdmin } from '../../../store';
import SharingPanel from '../../../components/pages/callouts/CalloutSharingPanel.vue';

import { useRoute } from 'vue-router';
import ItemStatusText from '../../../components/item/ItemStatusText.vue';
import { addBreadcrumb } from '../../../store/breadcrumb';
import {
  faBullhorn,
  faCaretDown,
  faShare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import AppNotification from '../../../components/AppNotification.vue';
import CalloutForm from '../../../components/pages/callouts/CalloutForm.vue';
import { addNotification } from '../../../store/notifications';

const props = defineProps<{ id: string }>();

const { t } = useI18n();
const route = useRoute();

addBreadcrumb(
  computed(() =>
    currentUser.value && callout.value
      ? isPreview.value
        ? [
            {
              title: t('menu.callouts'),
              to: '/admin/callouts',
              icon: faBullhorn,
            },
            {
              title: callout.value.title,
              to: '/admin/callouts/view/' + callout.value.slug,
            },
            { title: t('actions.preview') },
          ]
        : [
            {
              title: t('menu.callouts'),
              to: '/callouts',
              icon: faBullhorn,
            },
            { title: callout.value.title },
          ]
      : []
  )
);

const callout = ref<GetCalloutDataWith<'form'>>();
const responses = ref<Paginated<GetCalloutResponseDataWith<'answers'>>>();

const showSharingPanel = ref(false);
const showOnlyThankYou = ref(false);

const isPreview = computed(
  () => route.query.preview === null && canAdmin.value
);
const isOpen = computed(() => callout.value?.status === ItemStatus.Open);

const latestResponse = computed(() =>
  callout.value?.allowMultiple || isPreview.value
    ? undefined
    : responses.value?.items?.[0]
);

// Callout is only for members and current user isn't logged in
const showLoginPrompt = computed(
  () => isOpen.value && callout.value?.access === 'member' && !currentUser.value
);

// Callout is only for members and current user is not a member
const showMemberOnlyPrompt = computed(
  () =>
    isOpen.value &&
    !isPreview.value &&
    callout.value?.access === 'member' &&
    currentUser.value &&
    !currentUser.value.activeRoles.includes('member')
);

const showResponseForm = computed(
  () =>
    // Preview mode
    isPreview.value ||
    // Callout is open and current user has access
    (isOpen.value && !showLoginPrompt.value && !showMemberOnlyPrompt.value) ||
    // Current user has previously responded
    latestResponse.value
);

function handleSubmitResponse() {
  document.getElementById('thanks')?.scrollIntoView();
  showOnlyThankYou.value = true;
  addNotification({
    title: t('callout.responseSubmitted'),
    variant: 'success',
  });
}

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form']);

  responses.value = currentUser.value
    ? await fetchResponses(
        props.id,
        {
          rules: {
            condition: 'AND',
            rules: [{ field: 'contact', operator: 'equal', value: ['me'] }],
          },
          sort: 'createdAt',
          order: 'DESC',
        },
        ['answers']
      )
    : { total: 0, count: 0, offset: 0, items: [] };
});
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  height: 0;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-out;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 16rem;
  height: auto;
}
</style>
