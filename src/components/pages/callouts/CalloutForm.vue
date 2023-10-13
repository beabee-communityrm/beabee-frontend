<template>
  <form @submit.prevent>
    <GuestFields
      v-if="showGuestFields && !readonly"
      v-model:name="guestName"
      v-model:email="guestEmail"
    />
    <FormRenderer
      :key="currentSlide.id"
      v-model="answersProxy[currentSlide.id]"
      :components="currentSlide.components"
      :readonly="readonly"
      :no-bg="noBg"
    />
    <div :class="!noBg && 'bg-white p-6 pt-0 -mt-6 shadow-md'">
      <AppNotification
        v-if="formError"
        class="mt-4"
        variant="error"
        :title="formError"
      />
      <AppButton
        v-if="currentSlideNo === totalSlides - 1 && !readonly"
        type="submit"
        class="w-full mb-4"
        variant="primary"
        :disabled="validation.$invalid"
        :loading="isLoading"
        @click="handleSubmit"
      >
        {{ currentSlide.navigation.submitText }}
      </AppButton>
      <div v-if="totalSlides > 1" class="flex gap-4 justify-between">
        <div>
          <AppButton
            v-if="currentSlide.navigation.prevText"
            type="button"
            variant="primaryOutlined"
            :disabled="currentSlideNo === 0"
            @click="currentSlideNo--"
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
            @click="currentSlideNo++"
          >
            {{ currentSlide.navigation.nextText }}
          </AppButton>
        </div>
      </div>
    </div>
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
import AppButton from '../../button/AppButton.vue';
import useVuelidate from '@vuelidate/core';
import { sameAs } from '@vuelidate/validators';

const { t } = useI18n();

const emit = defineEmits<{ (e: 'submitted'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  answers?: CalloutResponseAnswers;
  preview?: boolean;
  readonly?: boolean;
  noBg?: boolean;
}>();

const validation = useVuelidate(
  { preview: { no: sameAs(false) } },
  { preview: props.preview }
);

const guestName = ref('');
const guestEmail = ref('');
const formError = ref('');
const isLoading = ref(false);

const initialAnswers = Object.fromEntries(
  props.callout.formSchema.slides.map((slide) => [
    slide.id,
    props.answers?.[slide.id] || {},
  ])
);

const answersProxy = ref<CalloutResponseAnswers>(initialAnswers);

const currentSlideNo = ref(0);
const currentSlide = computed(
  () => props.callout.formSchema.slides[currentSlideNo.value]
);
const totalSlides = computed(() => props.callout.formSchema.slides.length);

const showGuestFields = computed(
  () => props.callout.access === 'guest' && !currentUser.value
);

async function handleSubmit() {
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
</script>
