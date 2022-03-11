<template>
  <div v-if="callout" class="md:max-w-2xl">
    <h1 class="text-4xl font-bold mb-8">{{ callout.title }}</h1>
    <div class="flex justify-between items-center mb-8">
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
        icon="share"
        variant="primaryOutlined"
        >{{ t('common.share') }}</AppButton
      >
    </div>
    <figure class="relative mb-6 pb-[56.25%]">
      <img class="absolute w-full h-full object-cover" :src="callout.image" />
    </figure>
    <div
      class="text-lg content-message"
      v-html="callout.templateSchema.intro"
    />
    <div
      v-if="responses && !hasResponseSuccess"
      class="mt-10 pt-10 border-primary-40 border-t"
    >
      <form v-if="showResponseForm" class="callout-form" @submit.prevent>
        <GuestFields
          v-if="showGuestFields"
          v-model:name="guestName"
          v-model:email="guestEmail"
        />
        <Form
          :form="callout.templateSchema.formSchema"
          :submission="
            hasResponded && !callout.allowMultiple
              ? { data: responses.items[0].answers }
              : undefined
          "
          :options="{
            readOnly: hasResponded && !callout.allowUpdate,
            noAlerts: true,
          }"
          @submit="handleSubmitResponse"
        />
        <MessageBox v-if="hasResponseError" class="mt-4" type="error">
          {{ t('callout.submittingResponseError') }}
        </MessageBox>
      </form>
      <div v-if="!canRespond" class="">Login</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { Form } from 'vue-formio';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import {
  CalloutResponseAnswers,
  GetCalloutResponseData,
  GetMoreCalloutData,
  ItemStatus,
  Paginated,
} from '../../../utils/api/api.interface';
import {
  createResponse,
  fetchCallout,
  fetchResponses,
} from '../../../utils/api/callout';
import {
  formatLocale,
  formatDistanceLocale,
} from '../../../utils/dates/locale-date-formats';
import AppButton from '../../../components/forms/AppButton.vue';
import AppItemStatus from '../../../components/AppItemStatus.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { currentUser } from '../../../store';
import GuestFields from '../components/GuestFields.vue';
import axios from '../../../axios';

const route = useRoute();

const { t } = useI18n();

const callout = ref<GetMoreCalloutData>();
const responses = ref<Paginated<GetCalloutResponseData>>();

const guestName = ref('');
const guestEmail = ref('');

const hasResponded = computed(
  () => !!responses.value && responses.value.count > 0
);

const canRespond = computed(
  () => callout.value?.access !== 'member' || currentUser.value
);

const showResponseForm = computed(
  () =>
    (callout.value?.status === ItemStatus.Open && canRespond.value) ||
    hasResponded.value
);

const showGuestFields = computed(
  () => callout.value?.access === 'guest' && !currentUser.value
);

const hasResponseError = ref(false);

async function handleSubmitResponse(event: { data: CalloutResponseAnswers }) {
  hasResponseError.value = false;
  try {
    await createResponse(route.params.id as string, {
      ...(!currentUser.value && {
        guestName: guestName.value,
        guestEmail: guestEmail.value,
      }),
      answers: event.data,
    });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      hasResponseError.value = true;
    } else {
      throw err;
    }
  }
}

onBeforeMount(async () => {
  hasResponseError.value = false;

  const calloutId = route.params.id as string;

  callout.value = await fetchCallout(calloutId);

  responses.value = currentUser.value
    ? await fetchResponses(calloutId, {
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
