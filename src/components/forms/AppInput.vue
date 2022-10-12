<template>
  <AppLabel v-if="label" :label="label" :required="required" />
  <div class="flex items-center">
    <div
      class="flex items-center overflow-hidden rounded border border-primary-40 bg-white focus-within:shadow-input"
      :class="hasError && 'border-danger-70 bg-danger-10'"
    >
      <span v-if="prefix" class="flex-0 px-2">{{ prefix }}</span>
      <div
        class="flex-1"
        :class="{
          'border-l border-primary-40': prefix,
          'border-danger-70': hasError,
        }"
      >
        <input
          v-model.trim="value"
          class="w-full bg-white/0 p-2 leading-tight focus:outline-none"
          :type="type"
          :name="name"
          :required="required"
          :min="min"
          :pattern="pattern"
          v-bind="$attrs"
          @blur="validation.value.$touch"
        />
      </div>
    </div>
    <div v-if="$slots.after" class="flex-0 ml-2"><slot name="after" /></div>
  </div>

  <div
    v-if="hasError && !hideErrorMessage"
    class="mt-1.5 text-xs font-semibold text-danger"
    role="alert"
  >
    {{ validation.value.$errors[0].$message }}
  </div>

  <div v-if="infoMessage" class="mt-1.5 text-xs">
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
    type?: 'password' | 'email' | 'text' | 'date' | 'time' | 'number' | 'url';
    name?: string;
    label?: string;
    infoMessage?: string;
    required?: boolean;
    min?: number | string;
    sameAs?: number | string;
    pattern?: string;
    hideErrorMessage?: boolean;
    prefix?: string;
  }>(),
  {
    modelValue: undefined,
    type: 'text',
    name: 'unknown',
    label: undefined,
    infoMessage: undefined,
    min: undefined,
    sameAs: undefined,
    pattern: undefined,
    prefix: undefined,
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
      email: helpers.withMessage(errorT('email'), email),
    }),
    ...(props.type === 'url' && {
      url: helpers.withMessage(errorT('url'), url),
    }),
    ...(props.type === 'password' && {
      password: helpers.withMessage(errorT('password'), isPassword),
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
    ...(props.pattern !== undefined && {
      pattern: helpers.withMessage(
        errorT('pattern'),
        (value: number | string) =>
          new RegExp(`^(?:${props.pattern})$`).test(value.toString())
      ),
    }),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
