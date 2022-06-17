<template>
  <div class="mb-3">
    <AppInput
      v-model="emailProxy"
      input-type="email"
      :label="t('form.email')"
      required
      :error-message="errorGenerator(validation, 'email')"
      @blur="validation.email.$touch"
    />
  </div>

  <div class="mb-3">
    <AppInput
      v-model="firstNameProxy"
      input-type="text"
      :label="t('form.firstName')"
      :required="!optionalNames"
      :error-message="errorGenerator(validation, 'firstName')"
      @blur="validation.firstName.$touch"
    />
  </div>

  <div class="mb-3">
    <AppInput
      v-model="lastNameProxy"
      input-type="text"
      :label="t('form.lastName')"
      :required="!optionalNames"
      :error-message="errorGenerator(validation, 'lastName')"
      @blur="validation.lastName.$touch"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { helpers, requiredIf } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { errorGenerator } from '../utils/form-error-generator';
import { emailValidationRule } from '../utils/form-validation/rules';
import AppInput from './forms/AppInput.vue';

const { t } = useI18n();

const emit = defineEmits([
  'update:email',
  'update:firstName',
  'update:lastName',
]);
const props = defineProps<{
  email: string;
  firstName: string;
  lastName: string;
  optionalNames?: boolean;
}>();

const emailProxy = computed({
  get: () => props.email,
  set: (email) => emit('update:email', email),
});

const firstNameProxy = computed({
  get: () => props.firstName,
  set: (firstName) => emit('update:firstName', firstName),
});

const lastNameProxy = computed({
  get: () => props.lastName,
  set: (lastName) => emit('update:lastName', lastName),
});

const rules = {
  email: emailValidationRule,

  firstName: {
    required: helpers.withMessage(
      t('form.errors.firstName.required'),
      requiredIf(!props.optionalNames)
    ),
  },

  lastName: {
    required: helpers.withMessage(
      t('form.errors.lastName.required'),
      requiredIf(!props.optionalNames)
    ),
  },
};

const validation = useVuelidate(rules, {
  email: emailProxy,
  firstName: firstNameProxy,
  lastName: lastNameProxy,
});
</script>
