<route lang="yaml">
name: callout
meta:
  pageTitle: menu.callouts
  noAuth: true
  embeddable: true
</route>

<template>
  <div v-if="callout">
    <h1 v-if="!isEmbed" class="mb-6 font-title text-4xl font-bold">
      {{ callout.title }}
    </h1>

    <CalloutThanksBox
      v-if="latestResponse"
      id="thanks"
      :callout="callout"
      class="mb-6"
    />

    <AppBoxout
      v-else-if="!isOpen && callout.expires"
      :title="
        t('callout.ended', { date: formatLocale(callout.expires, 'PPP') })
      "
      :icon="faInfoCircle"
      class="mb-6"
      variant="info"
    />

    <div class="md:max-w-2xl flex flex-col gap-6">
      <template v-if="!isEmbed">
        <div
          v-if="isOpen || latestResponse"
          class="flex items-center justify-between"
        >
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
          @click="showResponseForm = true"
        >
          {{ t('callout.getStarted') }}
        </AppButton>

        <template v-else>
          <AppNotification
            v-if="isPreview"
            variant="warning"
            :title="t('callout.showingPreview')"
            class="mb-4"
          />

          <CalloutForm
            v-if="
              responses /* Form.IO doesn't handle reactivity so wait for responses to load */
            "
            :callout="callout"
            :answers="latestResponse?.answers"
            :preview="isPreview"
            :readonly="!canRespond"
            :style="isEmbed ? 'no-bg' : undefined"
            @submitted="handleSubmitResponse"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Paginated } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../../utils/api/callout';
import AppButton from '../../../components/button/AppButton.vue';
import { currentUser, canAdmin, isEmbed } from '../../../store';
import SharingPanel from '../../../components/pages/callouts/CalloutSharingPanel.vue';

import { useRoute } from 'vue-router';
import ItemStatusText from '../../../components/item/ItemStatusText.vue';
import { addBreadcrumb } from '../../../store/breadcrumb';
import {
  faBullhorn,
  faCaretDown,
  faInfoCircle,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import AppNotification from '../../../components/AppNotification.vue';
import CalloutForm from '../../../components/pages/callouts/CalloutForm.vue';
import { addNotification } from '../../../store/notifications';
import { useCallout } from '../../../components/pages/callouts/use-callout';
import CalloutLoginPrompt from '../../../components/pages/callouts/CalloutLoginPrompt.vue';
import CalloutMemberOnlyPrompt from '../../../components/pages/callouts/CalloutMemberOnlyPrompt.vue';
import CalloutThanksBox from '../../../components/pages/callouts/CalloutThanksBox.vue';
import AppBoxout from '../../../components/AppBoxout.vue';
import { formatLocale } from '../../../utils/dates';

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
const showResponseForm = ref(false);

const isPreview = computed(
  () => route.query.preview === null && canAdmin.value
);

const { isOpen, showLoginPrompt, showMemberOnlyPrompt } = useCallout(callout);

const latestResponse = computed(() =>
  callout.value?.allowMultiple || isPreview.value
    ? undefined
    : responses.value?.items?.[0]
);

const showResponsePanel = computed(
  () =>
    // Preview mode
    isPreview.value ||
    // Callout is open and current user has access
    (isOpen.value && !showLoginPrompt.value && !showMemberOnlyPrompt.value) ||
    // Current user has previously responded
    latestResponse.value
);

const canRespond = computed(
  () =>
    // Preview mode
    isPreview.value ||
    // Callout is open and current user hasn't responded or can update
    (isOpen.value && (!latestResponse.value || callout.value?.allowUpdate))
);

function handleSubmitResponse() {
  document.getElementById('thanks')?.scrollIntoView();
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
