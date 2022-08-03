<template>
  <AppLabel v-if="label" :label="label" :required="required" :for="inputType" />
  <input
    :id="inputType"
    v-model="value"
    class="
      p-2
      w-full
      border border-primary-40
      rounded
      focus:outline-none focus:shadow-input
    "
    :type="inputType"
    :placeholder="placeholder"
    :class="dangerClasses"
    v-bind="$attrs"
    :required="required"
  />

  <div
    v-if="errorMessage"
    class="text-xs text-danger font-semibold mt-1.5"
    role="alert"
  >
    {{ errorMessage }}
  </div>

  <div v-if="infoMessage" class="mt-2 text-xs">
    <InfoMessage :message="infoMessage" />
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity';
import InfoMessage from '../InfoMessage.vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue?: unknown;
    inputType?: 'password' | 'email' | 'text' | 'date' | 'number';
    label?: string;
    errorMessage?: string | Ref<string>;
    infoMessage?: string;
    required?: boolean;
    placeholder?: string;
  }>(),
  {
    modelValue: '' as any,
    inputType: 'text',
    label: undefined,
    errorMessage: undefined,
    infoMessage: undefined,
    required: false,
    placeholder: '',
  }
);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const dangerClasses = computed(() => {
  return props.errorMessage ? ['bg-danger-10', 'border-danger-70'] : null;
});
</script>
