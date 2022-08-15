<template>
  <AppLabel v-if="label" :label="label" :required="required" />
  <div class="flex items-center">
    <div class="flex-1">
      <input
        v-model.trim="value"
        class="
          p-2
          w-full
          border border-primary-40
          rounded
          focus:outline-none focus:shadow-input
        "
        :class="hasError && 'bg-danger-10 border-danger-70'"
        :type="type"
        :name="name"
        :required="required"
        :min="min"
        v-bind="$attrs"
        @blur="validation.value.$touch"
      />
    </div>
    <div v-if="$slots.suffix" class="flex-0 ml-2"><slot name="suffix" /></div>
  </div>

  <div
    v-if="hasError"
    class="text-xs text-danger font-semibold mt-1.5"
    role="alert"
  >
    {{ validation.value.$errors[0].$message }}
  </div>

  <div v-if="infoMessage" class="mt-2 text-xs">
    <InfoMessage :message="infoMessage" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { email, helpers, requiredIf, sameAs, url } from '@vuelidate/validators';
import InfoMessage from '../InfoMessage.vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue?: number | string;
    type?: 'password' | 'email' | 'text' | 'date' | 'number' | 'url';
    name?: string;
    label?: string;
    infoMessage?: string;
    required?: boolean;
    min?: number | string;
    sameAs?: number | string;
  }>(),
  {
    modelValue: undefined,
    type: 'text',
    name: 'unknown',
    label: undefined,
    infoMessage: undefined,
    min: undefined,
    sameAs: undefined,
  }
);

const { t } = useI18n();

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit(
      'update:modelValue',
      props.type === 'number' ? Number(newValue) : newValue
    );
  },
});

function errorT(key: string, context?: Record<string, unknown>): string {
  const keypath = `form.errors.${props.name}.${key}`;
  return context ? t(keypath, context) : t(keypath);
}

const rules = computed(() => ({
  value: {
    required: helpers.withMessage(
      errorT('required'),
      requiredIf(!!props.required)
    ),
    ...(props.type === 'email' && {
      email: helpers.withMessage(errorT('invalid'), email),
    }),
    ...(props.type === 'url' && {
      url: helpers.withMessage(errorT('invalid'), url),
    }),
    ...(props.type === 'password' && {
      password: helpers.withMessage(errorT('invalid'), isPassword),
    }),
    ...(props.min !== undefined && {
      min: helpers.withMessage(
        () => errorT('min', { min: props.min }),
        (value: number | string) => value >= props.min
      ),
    }),
    ...(props.sameAs !== undefined && {
      sameAs: helpers.withMessage(errorT('sameAs'), sameAs(props.sameAs)),
    }),
  },
}));

const validation = useVuelidate(rules, { value } as any); // TODO: type problem
const hasError = computed(() => validation.value.$errors.length > 0);

function isPassword(value: string) {
  if (!value) return true;
  return (
    value.length >= 8 &&
    /[0-9]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value)
  );
}
</script>
