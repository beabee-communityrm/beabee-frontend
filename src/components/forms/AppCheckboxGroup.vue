<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <AppCheckbox
      v-for="[value, optLabel] in options"
      :key="value"
      :model-value="modelValue.includes(value)"
      :label="optLabel"
      @update:model-value="handleUpdate(value, $event)"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import AppCheckbox from './AppCheckbox.vue';
import AppLabel from './AppLabel.vue';
import useVuelidate from '@vuelidate/core';
import { minValue } from '@vuelidate/validators';

const emit = defineEmits<(e: 'update:modelValue', value: string[]) => void>();
const props = defineProps<{
  modelValue: string[];
  options: [string, string][];
  label?: string;
  inline?: boolean;
  required?: boolean;
}>();

const minRequired = computed(() => (props.required ? 1 : 0));

useVuelidate(
  { v: { min: minValue(minRequired) } },
  { v: computed(() => props.modelValue.length) }
);

function handleUpdate(value: string, checked: boolean) {
  const newModelValue = checked
    ? [...props.modelValue, value]
    : props.modelValue.filter((v) => v !== value);
  emit('update:modelValue', newModelValue);
}
</script>
