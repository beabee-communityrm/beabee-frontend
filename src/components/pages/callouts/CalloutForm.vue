<template>
  <form class="text-lg" @submit.prevent>
    <GuestFields
      v-if="showGuestFields"
      v-model:name="guestName"
      v-model:email="guestEmail"
    />
    <Form
      class="callout-form-renderer"
      :form="callout.formSchema"
      :submission="response && { data: response }"
      :options="formOpts"
      @submit="handleSubmission"
    />
    <AppNotification
      v-if="formError"
      class="mt-4"
      variant="error"
      :title="formError"
    />
  </form>
</template>
<script lang="ts" setup>
import { CalloutResponseAnswers } from '@beabee/beabee-common';
import { computed, onBeforeMount, ref } from 'vue';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../utils/api/api.interface';
import { useI18n } from 'vue-i18n';
import { currentUser } from '../../../store';
import { createResponse } from '../../../utils/api/callout';
import { isRequestError } from '../../../utils/api';
import { config, dom, library } from '@fortawesome/fontawesome-svg-core';
import { Form } from '../../../lib/formio';
import {
  faCalendar,
  faCross,
  faCloudUpload,
  faRemove,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import GuestFields from './GuestFields.vue';
import AppNotification from '../../AppNotification.vue';

interface FormSubmission {
  data: CalloutResponseAnswers;
}

const { t } = useI18n();

const emit = defineEmits<{ (e: 'submitted'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  response: GetCalloutResponseDataWith<'answers'> | undefined;
  preview: boolean;
}>();

const guestName = ref('');
const guestEmail = ref('');
const formError = ref('');

const showGuestFields = computed(
  () => props.callout.access === 'guest' && !currentUser.value
);

const canSubmit = computed(() => !props.response || props.callout.allowUpdate);

const formOpts = computed(() => ({
  readOnly: !canSubmit.value,
  noAlerts: true,
  hooks: {
    beforeSubmit: (_: FormSubmission, next: () => void) => {
      // Can't submit in preview mode
      if (props.preview) {
        formError.value = t('callout.showingPreview');
        // If guest fields are required check they are filled in
      } else if (
        showGuestFields.value &&
        !(guestName.value && guestEmail.value)
      ) {
        formError.value = t('callout.form.guestFieldsMissing');
      } else {
        next();
      }
    },
  },
}));

async function handleSubmission(submission: FormSubmission) {
  formError.value = '';
  try {
    await createResponse(props.callout.slug, {
      ...(!currentUser.value &&
        props.callout?.access === 'guest' && {
          guestName: guestName.value,
          guestEmail: guestEmail.value,
        }),
      answers: submission.data,
    });
    emit('submitted');
  } catch (err) {
    if (isRequestError(err)) {
      formError.value = t('callout.form.submittingResponseError');
    } else {
      throw err;
    }
  }
}

onBeforeMount(() => {
  library.add(faCalendar, faCross, faCloudUpload, faRemove, faRefresh);
  config.autoReplaceSvg = 'nest';
  dom.watch();
});
</script>

<style>
@import '../../../lib/formio/formio.form.css';
@import '../../form-renderer/form-renderer.css';
</style>
