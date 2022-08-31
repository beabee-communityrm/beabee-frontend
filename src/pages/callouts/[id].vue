<route lang="yaml">
name: callout
meta:
  pageTitle: menu.callouts
  noAuth: true
</route>

<template>
  <div v-if="callout" class="md:max-w-2xl">
    <h1 class="font-title text-4xl font-bold mb-6">{{ callout.title }}</h1>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center text-sm text-body-40 font-semibold">
        <div>
          <div class="flex flex-col">
            <AppItemStatus :status="callout.status" />
            <span
              v-if="callout.status === ItemStatus.Scheduled && callout.starts"
            >
              {{
                t('callout.status.startsIn', {
                  duration: formatDistanceLocale(callout.starts, new Date()),
                })
              }}
            </span>
            <span
              v-else-if="callout.status === ItemStatus.Open && callout.expires"
            >
              {{
                t('callout.status.endsIn', {
                  duration: formatDistanceLocale(callout.expires, new Date()),
                })
              }}
            </span>
            <span
              v-else-if="callout.status === ItemStatus.Ended && callout.expires"
            >
              {{
                t('callout.status.endedOn', {
                  date: formatLocale(callout.expires, 'P'),
                })
              }}
            </span>
          </div>
        </div>
        <div v-if="hasResponded" class="border-body-40 border-l ml-3 pl-3 w-32">
          {{ t('callout.youResponded') }}
        </div>
      </div>
      <AppButton
        v-if="callout.status === ItemStatus.Open"
        :icon="showSharingPanel ? 'caret-down' : 'share'"
        variant="primaryOutlined"
        @click="toggleSharePanel"
        >{{ t('common.share') }}</AppButton
      >
    </div>
    <transition-group name="slide">
      <SharingPanel v-if="showSharingPanel" :slug="callout.slug" />
    </transition-group>
    <div
      v-if="showThanksMessage"
      class="flex mb-6 bg-white rounded p-6 text-lg text-success"
    >
      <div class="flex-0 mr-4 text-2xl">
        <font-awesome-icon icon="thumbs-up" />
      </div>
      <div>
        <h3 class="font-semibold">
          {{ callout.thanksTitle }}
        </h3>
        <div
          class="font-normal text-body-80 content-message"
          v-html="callout.thanksText"
        />
      </div>
    </div>
    <figure class="mb-6">
      <img class="w-full object-cover" :src="callout.image" />
    </figure>
    <div class="text-lg content-message mb-6" v-html="callout.intro" />
    <div
      class="w-full text-center flex flex-col justify-center items-center mb-6"
      v-if="canSeeButNotRespond"
    >
      <p class="w-full sm:w-2/3">
        {{ t('callout.membersOnly') }}
        <b>{{ t('callout.updateContribution') }}</b>
      </p>
      <AppButton
        class="w-full sm:w-1/2 mt-4"
        variant="link"
        to="/profile/contribution"
      >
        {{ t('callout.toContributionPage') }}
      </AppButton>
    </div>
    <form
      v-if="showResponseForm"
      class="callout-form mt-10 pt-10 border-primary-40 border-t"
      :class="{ 'opacity-50': isFormReadOnly }"
      @submit.prevent
    >
      <GuestFields
        v-if="showGuestFields"
        v-model:name="guestName"
        v-model:email="guestEmail"
      />
      <Form
        :form="callout.formSchema"
        :submission="formSubmission"
        :options="formOpts"
        @submit="(handleSubmitResponse as any)"
      />
      <MessageBox v-if="formError" class="mt-4" type="error">
        {{ formError }}
      </MessageBox>
    </form>
    <div v-if="showLoginPrompt" class="my-12">
      <p class="text-center">
        {{ t('callout.membersOnly') }}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 mt-6">
        <AppButton class="w-full" variant="link" to="/join">
          {{ t('callout.joinNow') }}
        </AppButton>
        <AppButton class="w-full" variant="linkOutlined" to="/auth/login">
          {{ t('callout.loginToYourAccount') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { Form } from 'vue-formio';
import { useI18n } from 'vue-i18n';
import {
  CalloutResponseAnswers,
  GetCalloutResponseData,
  GetMoreCalloutData,
  ItemStatus,
  Paginated,
} from '../../utils/api/api.interface';
import {
  createResponse,
  fetchCallout,
  fetchResponses,
} from '../../utils/api/callout';
import {
  formatLocale,
  formatDistanceLocale,
} from '../../utils/dates/locale-date-formats';
import AppButton from '../../components/forms/AppButton.vue';
import AppItemStatus from '../../components/AppItemStatus.vue';
import MessageBox from '../../components/MessageBox.vue';
import { currentUser } from '../../store';
import GuestFields from '../../components/pages/callouts/GuestFields.vue';
import SharingPanel from '../../components/pages/callouts/CalloutSharingPanel.vue';
import axios from '../../axios';

type FormSubmission = { data: CalloutResponseAnswers };

const props = defineProps<{ id: string }>();

const { t } = useI18n();

const callout = ref<GetMoreCalloutData>();
const responses = ref<Paginated<GetCalloutResponseData>>();

const guestName = ref('');
const guestEmail = ref('');

const showSharingPanel = ref(false);
const toggleSharePanel = () => {
  showSharingPanel.value = !showSharingPanel.value;
};

const hasResponded = computed(
  () => !!responses.value && responses.value.count > 0
);

const canRespond = computed(
  () =>
    callout.value?.access !== 'member' ||
    currentUser.value?.activeRoles.includes('member')
);

// edge-case where a member is:
// 1. logged in
// 2. to a member-only callout
// 3. but not contributing (anymore)
// and should be given some indication as
// to why they can't reply to a callout
const canSeeButNotRespond = computed(
  () =>
    callout.value?.access === 'member' &&
    currentUser.value &&
    !currentUser.value?.activeRoles.includes('member')
);

const showResponseForm = computed(
  () =>
    responses.value &&
    !showThanksMessage.value &&
    ((callout.value?.status === ItemStatus.Open && canRespond.value) ||
      hasResponded.value)
);

const showGuestFields = computed(
  () => callout.value?.access === 'guest' && !currentUser.value
);

const showLoginPrompt = computed(
  () => callout.value?.access === 'member' && !currentUser.value
);

const showThanksMessage = ref(false);

const isFormReadOnly = computed(
  () =>
    hasResponded.value &&
    !callout.value?.allowUpdate &&
    !callout.value?.allowMultiple
);

const formSubmission = computed(() =>
  callout.value &&
  !callout.value.allowMultiple &&
  // Should use `hasResponded` but type narrowing fails
  !!responses.value &&
  responses.value.count > 0
    ? { data: responses.value.items[0].answers }
    : undefined
);

const formOpts = computed(() => ({
  readOnly: isFormReadOnly.value,
  noAlerts: true,
  hooks: {
    beforeSubmit: (submission: FormSubmission, next: () => void) => {
      if (!showGuestFields.value || (guestName.value && guestEmail.value)) {
        next();
      } else {
        formError.value = t('callout.form.guestFieldsMissing');
      }
    },
  },
}));

const formError = ref('');

async function handleSubmitResponse(submission: FormSubmission) {
  formError.value = '';
  try {
    await createResponse(props.id, {
      ...(!currentUser.value &&
        callout.value?.access === 'guest' && {
          guestName: guestName.value,
          guestEmail: guestEmail.value,
        }),
      answers: submission.data,
    });
    showThanksMessage.value = true;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      formError.value = t('callout.form.submittingResponseError');
    } else {
      throw err;
    }
  }
}

onBeforeMount(async () => {
  formError.value = '';
  showThanksMessage.value = false;

  callout.value = await fetchCallout(props.id);

  responses.value = currentUser.value
    ? await fetchResponses(props.id, {
        rules: {
          condition: 'AND',
          rules: [{ field: 'member', operator: 'equal', value: 'me' }],
        },
        sort: 'createdAt',
        order: 'DESC',
      })
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
