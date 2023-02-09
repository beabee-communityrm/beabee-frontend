<template>
  <form @submit.prevent="handleSubmit">
    <slot />

    <AppNotification
      v-if="validation.$errors.length > 0"
      variant="error"
      :title="t('form.errorMessages.validation')"
      class="mb-4"
    />

    <div class="flex gap-2">
      <AppButton
        type="submit"
        variant="link"
        :loading="isLoading"
        :disabled="validation.$invalid"
      >
        {{ buttonText }}
      </AppButton>
      <AppButton v-if="resetButtonText" variant="text" @click="emit('reset')">
        {{ resetButtonText }}
      </AppButton>
      <slot name="buttons" :disabled="validation.$invalid" />
    </div>
  </form>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { addNotification } from '../../store/notifications';
import { getRequestError } from '../../utils/api';
import AppNotification from '../AppNotification.vue';
import AppButton from './AppButton.vue';

const emit = defineEmits(['reset']);
const props = defineProps<{
  buttonText: string;
  resetButtonText?: string;
  successText?: string;
  errorText?: string | Record<string, string>;
  onSubmit?: (evt: Event) => Promise<unknown> | unknown;
}>();

const { t } = useI18n();

const isLoading = ref(false);

const validation = useVuelidate();

async function handleSubmit(evt: Event) {
  isLoading.value = true;

  try {
    await props.onSubmit?.(evt);
    addNotification({
      title: props.successText || '',
      variant: 'success',
    });
  } catch (err) {
    const knownError = getRequestError(err);
    const errorText =
      (typeof props.errorText === 'object'
        ? knownError && knownError in props.errorText
          ? props.errorText[knownError]
          : props.errorText.unknown
        : props.errorText) || t('form.errorMessages.generic');
    addNotification({ title: errorText, variant: 'error' });
  } finally {
    isLoading.value = false;
  }
}
</script>
