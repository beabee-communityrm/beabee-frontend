<template>
  <form @submit.prevent>
    <h1 class="text-2.5xl mb-6">{{ t('forgotPassword.title') }}</h1>

    <template v-if="!isRequestSuccessful">
      <div class="mb-2">
        <p class="font-semibold">{{ t('forgotPassword.description') }}</p>
      </div>

      <div class="mb-5">
        <AppInput
          v-model="forgotPasswordData.email"
          input-type="email"
          :error-message="errorGenerator(forgotPasswordValidation, 'email')"
          @blur="forgotPasswordValidation.$touch"
        />
      </div>

      <AppButton
        variant="link"
        :disabled="isFormInvalid || loading"
        type="submit"
        @click="submitForgotPassword"
        >{{ t('forgotPassword.resetPassword') }}</AppButton
      >
    </template>

    <template v-else>
      <!-- TODO: fix by adding appropriate formatting -->
      <p class="mb-5 p-4 bg-primary-10 rounded">
        <i18n-t keypath="forgotPassword.message">
          <template #email>
            <b>{{ forgotPasswordData.email }}</b>
          </template>
        </i18n-t>
        <br />
        {{ t('forgotPassword.checkInbox') }}
      </p>

      <AppButton variant="link" to="/auth/login" type="submit">{{
        t('login.login')
      }}</AppButton>
    </template>
  </form>
</template>

<script lang="ts" setup>
import AppInput from '../../../components/forms/AppInput.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { errorGenerator } from '../../../utils/form-error-generator';
import { useForgotPassword } from './use-forgot-password';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const {
  loading,
  isFormInvalid,
  submitForgotPassword,
  forgotPasswordData,
  isRequestSuccessful,
  forgotPasswordValidation,
} = useForgotPassword();
</script>
