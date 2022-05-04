<template>
  <section class="mb-6">
    <h3 class="font-semibold text-lg mb-1">{{ t('join.memberAccount') }}</h3>

    <p class="mb-3 text-sm">
      {{ t('join.memberAlready') }}
      <router-link
        to="/auth/login"
        class="text-link hover:text-primary underline"
        >{{ t('join.login') }}</router-link
      >
    </p>

    <div class="mb-5">
      <AppInput
        v-model="emailProxy"
        input-type="email"
        :label="t('form.email')"
        :error-message="errorGenerator(validation, 'email')"
        @blur="validation.email.$touch"
      />
    </div>

    <AppInput
      v-model="passwordProxy"
      input-type="password"
      :label="t('form.password')"
      :error-message="errorGenerator(validation, 'password')"
      :info-message="t('form.passwordInfo')"
      @blur="validation.password.$touch"
    />
  </section>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import AppInput from '../../../../components/forms/AppInput.vue';
import { errorGenerator } from '../../../../utils/form-error-generator';
import { useI18n } from 'vue-i18n';
import {
  emailValidationRule,
  passwordValidationRule,
} from '../../../../utils/form-validation/rules';
import { computed } from 'vue';

const emit = defineEmits(['update:email', 'update:password']);
const props = defineProps<{
  email: string;
  password: string;
}>();

const emailProxy = computed({
  get: () => props.email,
  set: (email) => emit('update:email', email),
});

const passwordProxy = computed({
  get: () => props.password,
  set: (password) => emit('update:password', password),
});

const { t } = useI18n();

const validation = useVuelidate(
  {
    email: emailValidationRule,
    password: passwordValidationRule,
  },
  props
);
</script>
