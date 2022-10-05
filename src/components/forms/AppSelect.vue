<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <select
      v-model="value"
      class="w-full rounded border border-primary-40 bg-white p-2 leading-tight focus:shadow-input focus:outline-none"
      :class="inputClass"
      :required="required"
    >
      <option
        v-for="item in items"
        :key="item.id"
        :value="item.id"
        :selected="modelValue === item.id"
        :disabled="item.id === ''"
      >
        {{ item.label + (item.count ? ' (' + item.count + ')' : '') }}
      </option>
    </select>

    <div
      v-if="hasError"
      class="mt-1.5 text-xs font-semibold text-danger"
      role="alert"
    >
      {{ validation.value.$errors[0].$message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';
import { computed, toRef } from 'vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  label?: string;
  modelValue: string | null;
  items: {
    id: string;
    label: string;
    count?: string;
  }[];
  required?: boolean;
  inputClass?: string;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});

const isRequired = computed(() => !!props.required);

const validation = useVuelidate(
  {
    value: {
      required: requiredIf(isRequired),
    },
  } as any,
  { value } as any
);
const hasError = computed(() => validation.value.$errors.length > 0);
</script>
