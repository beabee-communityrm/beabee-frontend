<template>
  <AppLabel v-if="label" :label="label" :required="required" />
  <textarea
    v-model="value"
    class="w-full rounded border border-primary-40 p-2 focus:shadow-input focus:outline-none"
    :class="hasError && 'border-danger-70 bg-danger-10'"
    :required="required"
    v-bind="$attrs"
    @blur="validation.value.$touch"
  />

  <div
    v-if="hasError"
    class="mt-1.5 text-xs font-semibold text-danger"
    role="alert"
  >
    {{ validation.$errors[0].$message }}
  </div>

  <div v-if="infoMessage" class="mt-2 text-xs">
    <InfoMessage :message="infoMessage" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, requiredIf } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import InfoMessage from '../InfoMessage.vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    name?: string;
    infoMessage?: string;
    required?: boolean;
  }>(),
  {
    modelValue: '',
    label: undefined,
    name: 'unknown',
    infoMessage: undefined,
  }
);

const { t } = useI18n();

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});

const rules = computed(() => ({
  value: {
    required: helpers.withMessage(
      t(`form.errors.${props.name}.required`),
      requiredIf(!!props.required)
    ),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validation = useVuelidate(rules, { value } as any); // TODO: type problem
const hasError = computed(() => validation.value.$errors.length > 0);
</script>
