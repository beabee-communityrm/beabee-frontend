<template>
  <form @submit.prevent="handleSubmit">
    <slot />

    <MessageBox v-if="hasSuccess && successText" class="mb-4" type="success">
      {{ successText }}
    </MessageBox>

    <MessageBox v-if="hasError" class="mb-4" type="error">
      {{ errorText }}
    </MessageBox>

    <MessageBox
      v-if="validation.$errors.length > 0"
      type="error"
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
    </div>
  </form>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';
import MessageBox from '../MessageBox.vue';
import AppButton from './AppButton.vue';

const emit = defineEmits(['reset']);
const props = defineProps<{
  buttonText: string;
  resetButtonText?: string;
  successText?: string;
  errorText?: string;
  onSubmit?: (evt: Event) => Promise<unknown>;
}>();

const isLoading = ref(false);
const hasError = ref(false);
const hasSuccess = ref(false);

const validation = useVuelidate();

async function handleSubmit(evt: Event) {
  isLoading.value = true;
  hasError.value = false;
  hasSuccess.value = false;

  try {
    if (props.onSubmit) {
      await props.onSubmit(evt);
    }
    hasSuccess.value = true;
  } catch {
    hasError.value = true;
  } finally {
    isLoading.value = false;
  }
}
</script>
