<template>
  <form @submit.prevent="handleSubmit">
    <slot />

    <MessageBox v-if="successText" class="mb-4" type="success">
      {{ successText }}
    </MessageBox>

    <MessageBox v-if="errorText" class="mb-4" type="error">
      {{ errorText }}
    </MessageBox>

    <MessageBox v-if="validation.$errors.length > 0" type="error" class="mb-4">
      {{ t('form.errorMessages.validation') }}
    </MessageBox>

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
import { getRequestError } from '../../utils/api';
import MessageBox from '../MessageBox.vue';
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
const errorText = ref('');
const successText = ref('');

const validation = useVuelidate();

async function handleSubmit(evt: Event) {
  isLoading.value = true;
  errorText.value = '';
  successText.value = '';

  try {
    await props.onSubmit?.(evt);
    successText.value = props.successText || '';
  } catch (err) {
    const knownError = getRequestError(err);
    errorText.value =
      (typeof props.errorText === 'object'
        ? knownError && knownError in props.errorText
          ? props.errorText[knownError]
          : props.errorText.unknown
        : props.errorText) || t('form.errorMessages.generic');
  } finally {
    isLoading.value = false;
  }
}
</script>
