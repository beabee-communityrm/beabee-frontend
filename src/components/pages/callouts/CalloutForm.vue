<template>
  <form class="text-lg" @submit.prevent>
    <GuestFields
      v-if="showGuestFields"
      v-model:name="guestName"
      v-model:email="guestEmail"
    />
    <FormRenderer
      :form="callout.formSchema"
      :answers="answers"
      :readonly="readonly"
      :no-bg="noBg"
      :before-submit="beforeSubmit"
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
import { computed, ref } from 'vue';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import { useI18n } from 'vue-i18n';
import { currentUser } from '../../../store';
import { createResponse } from '../../../utils/api/callout';
import { isRequestError } from '../../../utils/api';
import GuestFields from './GuestFields.vue';
import AppNotification from '../../AppNotification.vue';
import FormRenderer from '../../form-renderer/FormRenderer.vue';
import { FormSubmission } from '../../form-renderer/form-renderer.interface';

const { t } = useI18n();

const emit = defineEmits<{ (e: 'submitted'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  answers?: CalloutResponseAnswers;
  preview?: boolean;
  readonly?: boolean;
  noBg?: boolean;
}>();

const guestName = ref('');
const guestEmail = ref('');
const formError = ref('');

const showGuestFields = computed(
  () => props.callout.access === 'guest' && !currentUser.value
);

function beforeSubmit(): boolean {
  formError.value = props.preview
    ? // Can't submit in preview mode
      t('callout.showingPreview')
    : showGuestFields.value && !(guestName.value && guestEmail.value)
    ? // If guest fields are required check they are filled in
      t('callout.form.guestFieldsMissing')
    : '';

  return !formError.value;
}

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
</script>
