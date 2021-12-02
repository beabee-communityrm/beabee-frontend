<template>
  <form @submit.prevent>
    <h1 class="text-2.5xl mb-6">
      {{ isSetPassword ? t('setPassword.title') : t('resetPassword.title') }}
    </h1>

    <div class="mb-5">
      <p class="font-semibold">
        {{
          isSetPassword
            ? t('setPassword.description')
            : t('resetPassword.description')
        }}
      </p>
    </div>

    <div class="mb-5">
      <AppInput
        v-model="resetPasswordData.password"
        :label="t('resetPassword.newPassword')"
        :info-message="t('form.passwordInfo')"
        input-type="password"
        :error-message="errorGenerator(resetPasswordValidation, 'password')"
        @blur="resetPasswordValidation.password.$touch"
      />
    </div>

    <div class="mb-6">
      <AppInput
        v-model="resetPasswordData.repeatPassword"
        :label="t('resetPassword.confirmPassword')"
        input-type="password"
        :error-message="
          errorGenerator(resetPasswordValidation, 'repeatPassword')
        "
        @blur="resetPasswordValidation.repeatPassword.$touch"
      />
    </div>

    <AppButton
      variant="link"
      :disabled="isFormInvalid || loading"
      class="mb-4 w-full"
      type="submit"
      @click="submitResetPassword(resetPasswordFlowId, router)"
      >{{
        isSetPassword ? t('common.login') : t('resetPassword.changePassword')
      }}</AppButton
    >

    <div v-if="!isSetPassword" class="text-center">
      <router-link
        variant="link"
        to="/auth/login"
        class="text-link underline font-semibold"
        >{{ t('resetPassword.login') }}</router-link
      >
    </div>
  </form>
</template>

<script lang="ts" setup>
import AppInput from '../../../components/forms/AppInput.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { errorGenerator } from '../../../utils/form-error-generator';
import { useResetPassword } from './use-reset-password';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const isSetPassword = route.params.type === 'set';
const resetPasswordFlowId = route.params.id as string;

const {
  loading,
  isFormInvalid,
  submitResetPassword,
  resetPasswordValidation,
  resetPasswordData,
} = useResetPassword();
</script>
