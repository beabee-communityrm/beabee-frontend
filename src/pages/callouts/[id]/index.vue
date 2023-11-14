<route lang="yaml">
name: callout
meta:
  pageTitle: menu.callouts
  noAuth: true
  embeddable: true
</route>

<template>
  <AppTitle v-if="!isEmbed" big>{{ callout.title }}</AppTitle>

  <div v-if="responses /* Avoids layout thrashing */">
    <CalloutThanksBox
      v-if="latestResponse || thanks"
      id="thanks"
      :callout="callout"
      class="mb-6"
    />

    <AppMessageBox
      v-else-if="!isOpen && callout.expires /* Type narrowing */"
      :title="
        t('callout.ended', { date: formatLocale(callout.expires, 'PPP') })
      "
      :icon="faInfoCircle"
      class="mb-6"
      variant="info"
    />

    <div class="md:max-w-2xl flex flex-col gap-6">
      <template v-if="!showResponseForm">
        <div
          v-if="isOpen || latestResponse"
          class="flex items-center justify-between"
        >
          <div class="flex items-center text-sm font-semibold text-body-60">
            <ItemStatusText :item="callout" />
            <span
              v-if="latestResponse"
              class="border-body-40 ml-3 w-32 border-l pl-3"
            >
              {{ t('callout.youResponded') }}
            </span>
          </div>
          <AppButton
            v-if="isOpen"
            :icon="showSharingPanel ? faCaretDown : faShare"
            variant="primaryOutlined"
            @click="showSharingPanel = !showSharingPanel"
          >
            {{ t('common.share') }}
          </AppButton>
        </div>

        <transition name="slide">
          <SharingPanel v-if="showSharingPanel" :slug="callout.slug" />
        </transition>

        <img class="w-full" :src="callout.image" />
        <div class="content-message text-lg" v-html="callout.intro" />
      </template>

      <CalloutLoginPrompt v-if="showLoginPrompt" />
      <CalloutMemberOnlyPrompt v-else-if="showMemberOnlyPrompt && !isPreview" />
      <div v-else-if="showResponsePanel">
        <AppButton
          v-if="canRespond && !showResponseForm"
          class="w-full"
          :to="{
            path: '/callouts/' + callout.slug + '/respond',
            query: { preview: isPreview ? null : undefined },
          }"
        >
          {{
            latestResponse
              ? t('callout.actions.updateResponse')
              : t('actions.getStarted')
          }}
        </AppButton>

        <template v-else>
          <AppNotification
            v-if="isPreview"
            variant="warning"
            :title="t('callout.showingPreview')"
            class="mb-4"
          />

          <AppHeading v-if="latestResponse" class="mt-6">
            {{ t('callout.yourResponse') }}
          </AppHeading>

          <CalloutForm
            :callout="callout"
            :answers="latestResponse?.answers"
            :preview="isPreview"
            :readonly="!canRespond"
            :all-slides="!canRespond"
            :no-bg="isEmbed"
            @submitted="handleSubmitResponse"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import {
  faBullhorn,
  faCaretDown,
  faInfoCircle,
  faShare,
} from '@fortawesome/free-solid-svg-icons';

import AppButton from '@components/button/AppButton.vue';
import SharingPanel from '@components/pages/callouts/CalloutSharingPanel.vue';
import ItemStatusText from '@components/item/ItemStatusText.vue';
import AppNotification from '@components/AppNotification.vue';
import CalloutForm from '@components/pages/callouts/CalloutForm.vue';
import { useCallout } from '@components/pages/callouts/use-callout';
import CalloutLoginPrompt from '@components/pages/callouts/CalloutLoginPrompt.vue';
import CalloutMemberOnlyPrompt from '@components/pages/callouts/CalloutMemberOnlyPrompt.vue';
import CalloutThanksBox from '@components/pages/callouts/CalloutThanksBox.vue';
import AppMessageBox from '@components/AppMessageBox.vue';
import AppHeading from '@components/AppHeading.vue';
import AppTitle from '@components/AppTitle.vue';

import { fetchResponses } from '@utils/api/callout';
import { formatLocale } from '@utils/dates';

import { currentUser, canAdmin, isEmbed } from '@store';
import { addNotification } from '@store/notifications';
import { addBreadcrumb } from '@store/breadcrumb';

import type { GetCalloutDataWith, GetCalloutResponseDataWith } from '@type';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  respond?: boolean; // Flag for /respond route
  thanks?: boolean; // Flag for /thanks route
  // Suppress the warning about the ID prop being passed by the router
  id?: string;
}>();

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

addBreadcrumb(
  computed(() =>
    currentUser.value
      ? isPreview.value
        ? [
            {
              title: t('menu.callouts'),
              to: '/admin/callouts',
              icon: faBullhorn,
            },
            {
              title: props.callout.title,
              to: '/admin/callouts/view/' + props.callout.slug,
            },
            { title: t('actions.preview') },
          ]
        : [
            {
              title: t('menu.callouts'),
              to: '/callouts',
              icon: faBullhorn,
            },
            {
              title: props.callout.title,
              to: '/callouts/' + props.callout.slug,
            },
            ...(props.respond ? [{ title: t('actions.respond') }] : []),
          ]
      : []
  )
);

const responses = ref<Paginated<GetCalloutResponseDataWith<'answers'>>>();

const showSharingPanel = ref(false);

const isPreview = computed(
  () => route.query.preview === null && canAdmin.value
);

const { isOpen, showLoginPrompt, showMemberOnlyPrompt } = useCallout(
  toRef(props, 'callout')
);

const latestResponse = computed(() =>
  props.callout.allowMultiple || isPreview.value
    ? undefined
    : responses.value?.items?.[0]
);

const showResponsePanel = computed(
  () =>
    // Preview mode
    isPreview.value ||
    // Current user has previously responded
    latestResponse.value ||
    // Callout is open, current user has access and not on the thanks page
    (isOpen.value &&
      !showLoginPrompt.value &&
      !showMemberOnlyPrompt.value &&
      !props.thanks)
);

const showResponseForm = computed(() => isEmbed || props.respond);

const canRespond = computed(
  () =>
    // Preview mode
    isPreview.value ||
    // Callout is open and current user hasn't responded or can update
    (isOpen.value && (!latestResponse.value || props.callout.allowUpdate))
);

function handleSubmitResponse() {
  router.push({ path: `/callouts/${props.callout.slug}/thanks` });

  addNotification({
    title: t('callout.responseSubmitted'),
    variant: 'success',
  });
}

onBeforeMount(async () => {
  responses.value = currentUser.value
    ? await fetchResponses(
        props.callout.slug,
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
