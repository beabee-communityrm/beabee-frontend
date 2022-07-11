<template>
  <AppLabel v-if="label" :label="label" :required="required" />
  <textarea
    v-model="value"
    class="
      p-2
      w-full
      border border-primary-40
      rounded
      focus:outline-none focus:shadow-input
    "
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
    modelValue?: string;
    label?: string;
    errorMessage?: string | Ref<string>;
    infoMessage?: string;
    required?: boolean;
  }>(),
  {
    modelValue: '',
    label: undefined,
    errorMessage: undefined,
    infoMessage: undefined,
    required: false,
  }
);

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});

const dangerClasses = computed(() => {
  return props.errorMessage ? ['bg-danger-10', 'border-danger-70'] : null;
});
</script>
