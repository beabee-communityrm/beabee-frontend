<template>
  <div>
    <AppNotification
      v-if="preview"
      variant="warning"
      :title="t('callout.showingPreview')"
      class="mb-4"
    />

    <AppNotification
      v-if="responseNotice"
      class="mb-4"
      :title="responseNotice"
      variant="success"
    />

    <form @submit.prevent>
      <div class="callout-form mt-4">
        <CalloutGuestFields
          v-if="!isWizard && showGuestFields"
          v-model:name="guestName"
          v-model:email="guestEmail"
        />

        <Form
          ref="formRef"
          :form="callout.formSchema"
          :submission="
            response && !callout.allowMultiple
              ? { data: response.answers }
              : undefined
          "
          :options="formOpts"
          @submit="handleSubmission"
        />

        <template v-if="isWizard">
          <template v-if="isLastPage">
            <CalloutGuestFields
              v-if="showGuestFields"
              v-model:name="guestName"
              v-model:email="guestEmail"
            />

            <AppNotification
              v-if="formError"
              class="mb-4"
              variant="error"
              :title="formError"
            />
          </template>

          <template v-if="currentPage">
            <AppButton
              v-if="isLastPage"
              type="submit"
              class="mb-4 w-full"
              @click="handleSubmit"
            >
              {{ currentPage.navigation.submitText }}
            </AppButton>

            <div class="flex justify-between">
              <div>
                <AppButton
                  v-if="currentPage.navigation.showPrev && !isFirstPage"
                  variant="linkOutlined"
                  :disabled="changingPage"
                  @click="handlePrevPage"
                >
                  {{ currentPage.navigation.prevText }}
                </AppButton>
              </div>
              <div>
                <AppButton
                  v-if="!isLastPage && currentPage.navigation.showNext"
                  :disabled="changingPage"
                  @click="handleNextPage"
                >
                  {{ currentPage.navigation.nextText }}
                </AppButton>
              </div>
            </div>
          </template>
        </template>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import {
  CalloutPageSchema,
  CalloutResponseAnswers,
  ItemStatus,
} from '@beabee/beabee-common';
import { dom, library } from '@fortawesome/fontawesome-svg-core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { computed, onBeforeMount, reactive, ref } from 'vue';
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
import { formatLocale } from '../../../utils/dates';

interface FormSubmission {
  data: CalloutResponseAnswers;
}

interface FormRef {
  formio: {
    getPageIndexByKey(key: string): number;
    setPage(n: number): Promise<void>;
    nextPage(): Promise<void>;
    prevPage(): Promise<void>;
    checkValidity(
      data: CalloutResponseAnswers,
      dirty: boolean,
      row: CalloutResponseAnswers,
      currentPageOnly: boolean
    ): boolean;
    submit(): Promise<FormSubmission>;

    components: CalloutPageSchema[];
    currentPage: CalloutPageSchema;
    localData: CalloutResponseAnswers;
  };
}

const emit = defineEmits<{ (e: 'submitted'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  response: GetCalloutResponseDataWith<'answers'> | undefined;
  preview: boolean;
}>();

const { t } = useI18n();

const formRef = ref<FormRef | null>(null);

const guestName = ref('');
const guestEmail = ref('');
const formError = ref('');
const changingPage = ref(false);

const pageKeys = reactive<string[]>([
  props.callout.formSchema.components[0].key,
]);

const isWizard = computed(() => props.callout.formSchema.display === 'wizard');

const currentPageKey = computed(() => pageKeys[pageKeys.length - 1]);

const currentPage = computed(() =>
  isWizard.value
    ? props.callout.formSchema.components.find(
        (c) => c.key === currentPageKey.value
      )
    : undefined
);
const isFirstPage = computed(
  () => currentPageKey.value === props.callout.formSchema.components[0].key
);
const isLastPage = computed(() => {
  const components = props.callout.formSchema.components;
  return currentPageKey.value === components[components.length - 1].key;
});

const showGuestFields = computed(
  () => props.callout.access === 'guest' && !currentUser.value
);

const formOpts = computed(() => ({
  readOnly:
    props.response &&
    !(props.callout.allowUpdate || props.callout.allowMultiple),
  noAlerts: true,
  hooks: {
    beforeSubmit: (_: FormSubmission, next: () => void) => {
      // Can't submit in preview mode
      if (props.preview) {
        formError.value = t('callout.form.previewMode');
      }

      // If guest fields are required check they are filled in
      if (!showGuestFields.value || (guestName.value && guestEmail.value)) {
        next();
      } else {
        formError.value = t('callout.form.guestFieldsMissing');
      }
    },
  },
  breadcrumbSettings: {
    clickable: false,
  },
}));

const responseNotice = computed(() => {
  if (!props.response || props.callout.allowMultiple) return;

  const key =
    props.callout.allowUpdate && props.callout.status === ItemStatus.Open
      ? 'callout.form.respondedCanUpdate'
      : 'callout.form.responded';

  return t(key, { date: formatLocale(props.response.createdAt, 'PPP') });
});

async function handleNextPage() {
  if (!formRef.value) return; // Can't change page without the form

  changingPage.value = true;

  try {
    const formio = formRef.value.formio;

    const nextPageKey = currentPage.value?.navigation.nextSlideId;
    if (nextPageKey) {
      // setPage doesn't validate the input, so we need to do it ourselves
      // Copied from formiojs nextPage() method
      if (
        formio.checkValidity(formio.localData, true, formio.localData, true)
      ) {
        await formio.setPage(formio.getPageIndexByKey(nextPageKey));
      } else {
        throw new Error('Invalid form');
      }
    } else {
      await formio.nextPage();
    }

    pageKeys.push(formio.currentPage.key);

    // Invalid forms throw an exception
    // eslint-disable-next-line no-empty
  } catch (err) {}

  changingPage.value = false;
}

async function handlePrevPage() {
  if (!formRef.value) return; // Can't change page without the form

  changingPage.value = true;

  const formio = formRef.value.formio;

  const prevPageKey = pageKeys[pageKeys.length - 2];
  await formRef.value.formio.setPage(formio.getPageIndexByKey(prevPageKey));

  changingPage.value = false;
  pageKeys.pop();
}

async function handleSubmit() {
  if (!formRef.value) return; // Can't submit without the form

  if (isWizard.value) {
    // Hide the pages that weren't part of the journey, this disables their validation
    for (const component of formRef.value.formio.components) {
      component.visible = pageKeys.includes(component.key);
    }
  }

  await formRef.value.formio.submit();
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

onBeforeMount(() => {
  library.add(faCalendar);
  dom.watch();
});
</script>
