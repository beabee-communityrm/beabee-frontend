<template>
  <div class="mb-4">
    <AppInput
      v-model="nameProxy"
      label="Your name"
      required
      :error-message="errorGenerator(validation, 'name')"
      @blur="validation.name.$touch"
    />
  </div>
  <div class="mb-4">
    <AppInput
      v-model="emailProxy"
      input-type="email"
      label="Your email"
      required
      :error-message="errorGenerator(validation, 'email')"
      @blur="validation.email.$touch"
    />
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../components/forms/AppInput.vue';
import { errorGenerator } from '../../../utils/form-error-generator';
import { emailValidationRule } from '../../../utils/form-validation/rules';

const emit = defineEmits(['update:name', 'update:email']);

const { t } = useI18n();

const props = defineProps<{
  name: string;
  email: string;
}>();

const nameProxy = computed({
  get: () => props.name,
  set: (name) => emit('update:name', name),
});
const emailProxy = computed({
  get: () => props.email,
  set: (email) => emit('update:email', email),
});

const validation = useVuelidate(
  {
    email: emailValidationRule,
    name: {
      required: helpers.withMessage(t('form.errors.name.required'), required),
    },
  },
  {
    name: nameProxy,
    email: emailProxy,
  }
);
</script>
