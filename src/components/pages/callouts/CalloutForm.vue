<template>
  <form class="callout-form" :class="formStyle" @submit.prevent>
    <FormRenderer
      :key="currentSlide.id"
      v-model="answersProxy[currentSlide.id]"
      :components="currentSlide.components"
      :readonly="readonly"
    />
    <template v-if="isLastSlide && !readonly && !preview">
      <GuestFields
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
      <AppButton
        type="submit"
        class="w-full mb-4"
        variant="primary"
        :disabled="validation.$invalid"
        :loading="isLoading"
        @click="handleSubmit"
      >
        {{ currentSlide.navigation.submitText }}
      </AppButton>
    </template>
    <div v-if="totalSlides > 1" class="flex gap-4 justify-between">
      <div>
        <AppButton
          v-if="currentSlide.navigation.prevText"
          type="button"
          variant="primaryOutlined"
          :disabled="currentSlideNo === 0"
          @click="handlePrevSlide"
        >
          {{ currentSlide.navigation.prevText }}
        </AppButton>
      </div>
      <div>
        <AppButton
          v-if="currentSlideNo < totalSlides - 1"
          type="button"
          variant="primary"
          :disabled="validation.$invalid"
          @click="handleNextSlide"
        >
          {{ currentSlide.navigation.nextText }}
        </AppButton>
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import {
  CalloutResponseAnswers,
  CalloutSlideSchema,
} from '@beabee/beabee-common';
import { computed, ref } from 'vue';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import { useI18n } from 'vue-i18n';
import { currentUser } from '../../../store';
import { createResponse } from '../../../utils/api/callout';
import { isRequestError } from '../../../utils/api';
import GuestFields from './GuestFields.vue';
import AppNotification from '../../AppNotification.vue';
import FormRenderer from '../../form-renderer/FormRenderer.vue';
import AppButton from '../../button/AppButton.vue';
import useVuelidate from '@vuelidate/core';

const { t } = useI18n();
const validation = useVuelidate();

const emit = defineEmits<{ (e: 'submitted'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  answers?: CalloutResponseAnswers;
  preview?: boolean;
  readonly?: boolean;
  style?: 'simple' | 'no-bg' | 'small';
  onSubmit?(answers: CalloutResponseAnswers): void;
}>();

const guestName = ref('');
const guestEmail = ref('');
const formError = ref('');
const isLoading = ref(false);

const formStyle = computed(() => {
  switch (props.style) {
    case 'small':
      return 'is-small';
    case 'simple':
      return 'is-simple';
    case 'no-bg':
      return '';
    default:
      return 'has-bg';
  }
});

const slides = computed(() => props.callout.formSchema.slides);

const initialAnswers = Object.fromEntries(
  slides.value.map((slide) => [slide.id, props.answers?.[slide.id] || {}])
);

const answersProxy = ref<CalloutResponseAnswers>(initialAnswers);

const slideIds = ref<string[]>([slides.value[0].id]);

const currentSlide = computed(
  () =>
    slides.value.find((s) => s.id === slideIds.value[0]) as CalloutSlideSchema // Should always be defined
);

const currentSlideNo = computed(() => slides.value.indexOf(currentSlide.value));

const totalSlides = computed(() => slides.value.length);
const isLastSlide = computed(
  () => currentSlideNo.value === totalSlides.value - 1
);

const showGuestFields = computed(
  () => props.callout.access === 'guest' && !currentUser.value
);

async function handleSubmit() {
  if (props.onSubmit) {
    return props.onSubmit(answersProxy.value);
  }

  formError.value = '';
  isLoading.value = true;
  try {
    await createResponse(props.callout.slug, {
      ...(!currentUser.value &&
        props.callout?.access === 'guest' && {
          guestName: guestName.value,
          guestEmail: guestEmail.value,
        }),
      answers: answersProxy.value,
    });
    emit('submitted');
  } catch (err) {
    formError.value = t('callout.form.submittingResponseError');
    if (!isRequestError(err)) throw err;
  } finally {
    isLoading.value = false;
  }
}

function handleNextSlide() {
  const nextId =
    currentSlide.value.navigation.nextSlideId ||
    slides.value[currentSlideNo.value + 1].id;

  slideIds.value.unshift(nextId);
}

function handlePrevSlide() {
  slideIds.value.shift();
}
</script>
