<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <label
      v-for="[value, optLabel] in options"
      :key="value.toString()"
      class="items-center mb-1"
      :class="inline ? 'inline-flex mr-3' : 'flex'"
    >
      <input
        v-model="selected"
        type="radio"
        :name="name"
        :value="value"
        :checked="modelValue === value"
        class="mr-1"
        :required="required"
      />
      {{ optLabel }}
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AppLabel from './AppLabel.vue';
const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string | boolean | number | null;
  options: [string | boolean | number, string][];
  name: string;
  label?: string;
  inline?: boolean;
  required?: boolean;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});
</script>
