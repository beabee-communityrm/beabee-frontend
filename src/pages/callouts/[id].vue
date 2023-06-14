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
        <div v-if="hasResponded" class="border-body-40 ml-3 w-32 border-l pl-3">
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
      v-show="hasResponded"
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

    <div v-if="showMemberOnlyPrompt && !isPreview" class="my-12 text-center">
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

    <CalloutForm
      v-if="
        showResponseForm &&
        responses /* Form.IO doesn't handle reactivity so wait for responses to load */
      "
      class="mt-10 border-t border-primary-40 pt-10 text-lg"
      :callout="callout"
      :response="callout.allowMultiple ? undefined : latestResponse"
      :preview="isPreview"
      :readonly="isFormReadOnly"
      @submitted="handleSubmitResponse"
    />
  </div>
</template>
<script lang="ts" setup>
import { Paginated, ItemStatus } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../utils/api/callout';
import AppButton from '../../components/button/AppButton.vue';
import { currentUser, canAdmin } from '../../store';
import SharingPanel from '../../components/pages/callouts/CalloutSharingPanel.vue';

import { useRoute } from 'vue-router';
import ItemStatusText from '../../components/item/ItemStatusText.vue';
import { addBreadcrumb } from '../../store/breadcrumb';
import {
  faBullhorn,
  faCaretDown,
  faShare,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import CalloutForm from '../../components/pages/callouts/CalloutForm.vue';

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
const hasSubmittedResponse = ref(false);

const isPreview = computed(
  () => route.query.preview === null && canAdmin.value
);

const latestResponse = computed(() => responses.value?.items?.[0]);

const hasResponded = computed(
  () => latestResponse.value || hasSubmittedResponse.value
);

// Callout is open and available to all or current user is a member
const canRespond = computed(
  () =>
    callout.value?.status === ItemStatus.Open &&
    (callout.value?.access !== 'member' ||
      currentUser.value?.activeRoles.includes('member'))
);

// Callout is only for members and current user isn't logged in
const showLoginPrompt = computed(
  () => callout.value?.access === 'member' && !currentUser.value
);

// Callout is only for members and current user is not a member
const showMemberOnlyPrompt = computed(
  () =>
    callout.value?.access === 'member' &&
    currentUser.value &&
    !currentUser.value.activeRoles.includes('member')
);

// Either we are previewing, or user can respond, or has already responded
const showResponseForm = computed(
  () => isPreview.value || canRespond.value || hasResponded.value
);

const isFormReadOnly = computed(
  () =>
    hasSubmittedResponse.value ||
    (hasResponded.value &&
      !callout.value?.allowUpdate &&
      !callout.value?.allowMultiple)
);

async function handleSubmitResponse() {
  hasSubmittedResponse.value = true;
  document.getElementById('top')?.scrollIntoView();
}

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form']);

  responses.value =
    currentUser.value && !isPreview.value
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
