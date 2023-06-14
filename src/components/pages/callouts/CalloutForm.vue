<template>
  <div>
    <AppNotification
      v-if="preview"
      variant="warning"
      :title="t('callout.showingPreview')"
      class="mb-4"
    />

    <form @submit.prevent>
      <CalloutGuestFields
        v-if="showGuestFields"
        v-model:name="guestName"
        v-model:email="guestEmail"
      />
      <div class="callout-form mt-4">
        <Form
          ref="formRef"
          :form="callout.formSchema"
          :submission="response"
          :options="formOpts"
          @submit="handleSubmit"
        />
        <AppNotification
          v-if="formError"
          class="mb-4"
          variant="error"
          :title="formError"
        />
        <div class="flex justify-between">
          <div>
            <AppButton
              v-if="currentPageNavigation.showPrev && !isFirstPage"
              :disabled="changingPage"
              @click="handlePrevPage"
            >
              {{ currentPageNavigation.prevText }}
            </AppButton>
          </div>
          <div>
            <AppButton v-if="isLastPage" type="submit">
              {{ currentPageNavigation.submitText }}
            </AppButton>
            <AppButton
              v-else-if="currentPageNavigation.showNext"
              :disabled="changingPage"
              @click="handleNextPage"
            >
              {{ currentPageNavigation.nextText }}
            </AppButton>
          </div>
        </div>
        {{ currentPageNavigation }}
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { CalloutResponseAnswers } from '@beabee/beabee-common';
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Form } from 'vue-formio';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../utils/api/api.interface';
import { currentUser } from '../../../store';
import CalloutGuestFields from './CalloutGuestFields.vue';
import { createResponse } from '../../../utils/api/callout';
import { isRequestError } from '../../../utils/api';
import AppNotification from '../../AppNotification.vue';

import 'formiojs/dist/formio.form.css';
import AppButton from '../../button/AppButton.vue';

interface FormRef {
  formio: {
    setPage(n: number): Promise<unknown>;
    nextPage(): Promise<unknown>;
    prevPage(): Promise<unknown>;
    page: number;
  };
}

interface FormSubmission {
  data: CalloutResponseAnswers;
}

const emit = defineEmits<{ (e: 'submitted'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  response: GetCalloutResponseDataWith<'answers'>;
  preview: boolean;
  readonly: boolean;
}>();

const { t } = useI18n();

const formRef = ref<FormRef | null>(null);

const guestName = ref('');
const guestEmail = ref('');
const formError = ref('');
const currentPageNo = ref(0);
const changingPage = ref(false);

const prevPageNos: number[] = [];

const currentPageNavigation = computed(
  () => props.callout.formSchema.navigation[currentPageNo.value]
);
const isFirstPage = computed(() => currentPageNo.value === 0);
const isLastPage = computed(
  () => currentPageNo.value === props.callout.formSchema.navigation.length - 1
);

const showGuestFields = computed(
  () => props.callout.access === 'guest' && !currentUser.value
);

const formOpts = computed(() => ({
  readOnly: props.readonly,
  noAlerts: true,
  hooks: {
    beforeSubmit: (submission: FormSubmission, next: () => void) => {
      if (props.preview) {
        return;
      }

      if (!showGuestFields.value || (guestName.value && guestEmail.value)) {
        next();
      } else {
        formError.value = t('callout.form.guestFieldsMissing');
      }
    },
  },
}));

async function handleNextPage() {
  if (!formRef.value) return; // Can't change page without the form

  changingPage.value = true;

  try {
    if (currentPageNavigation.value.nextSlideId) {
      const nextPageNo = props.callout.formSchema.components.findIndex(
        (c) => c.id === currentPageNavigation.value.nextSlideId
      );
      await formRef.value.formio.setPage(nextPageNo);
    } else {
      await formRef.value.formio.nextPage();
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}

  changingPage.value = false;

  prevPageNos.push(currentPageNo.value);
  currentPageNo.value = formRef.value.formio.page;
}

async function handlePrevPage() {
  if (!formRef.value) return; // Can't change page without the form

  changingPage.value = true;

  const prevPageNo = prevPageNos[prevPageNos.length - 1];
  await formRef.value.formio.setPage(prevPageNo || 0);

  changingPage.value = false;

  prevPageNos.pop();
  currentPageNo.value = formRef.value.formio.page;
}

async function handleSubmit(submission: FormSubmission) {
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
  library.add(faCalendar);
  dom.watch();
});
</script>
