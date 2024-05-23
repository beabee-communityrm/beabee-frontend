<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <VueMultiselect
      v-model="value"
      :disabled="disabled"
      :allow-empty="!required"
      :options="items"
      track-by="id"
      label="label"
      :searchable="searchable"
      :show-labels="false"
      :show-pointer="false"
      :placeholder="placeholder"
    />
    <AppInputError v-if="hasError" :message="validation.$errors[0].$message" />
    <AppInputHelp v-if="infoMessage" :message="infoMessage" />
  </div>
</template>

<script lang="ts" setup generic="T extends string | number">
import useVuelidate from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';
import { computed } from 'vue';
import VueMultiselect from 'vue-multiselect';
import AppLabel from './AppLabel.vue';
import type { SelectItem } from './form.interface';
import AppInputError from './AppInputError.vue';
import AppInputHelp from './AppInputHelp.vue';

const emit = defineEmits<(e: 'update:modelValue', value: T) => void>();
const props = defineProps<{
  label?: string;
  modelValue?: T;
  items: SelectItem<T>[];
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  inputClass?: string;
  infoMessage?: string;
}>();

const value = computed({
  get: () => props.items.find((i) => i.id === props.modelValue),
  set: (newValue) => emit('update:modelValue', newValue!.id),
});

const isRequired = computed(() => !!props.required);

const validation = useVuelidate(
  { v: { required: requiredIf(isRequired) } },
  { v: value }
);
const hasError = computed(() => validation.value.$errors.length > 0);
</script>
