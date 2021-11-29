<template>
  <form @submit.prevent>
    <h1 class="text-2.5xl mb-2">{{ t('login.title') }}</h1>

    <div class="mb-5">
      <span>{{ t('login.notMember') }}</span>
      <router-link to="/join" class="text-link underline ml-1 font-semibold">{{
        t('login.joinNow')
      }}</router-link>
    </div>

    <div class="mb-5">
      <AppInput
        v-model="loginData.email"
        input-type="email"
        :label="t('form.email')"
        :error-message="errorGenerator(loginValidation, 'email')"
        @blur="loginValidation.email.$touch"
      />
    </div>

    <div class="mb-3">
      <AppInput
        v-model="loginData.password"
        input-type="password"
        :label="t('form.password')"
        :error-message="errorGenerator(loginValidation, 'password')"
        @blur="loginValidation.password.$touch"
      />
    </div>

    <div class="mb-8">
      <router-link class="underline text-xs" to="/auth/forgot-password">
        {{ t('login.forgotPassword') }}
      </router-link>
    </div>

    <MessageBox v-if="hasLoginFormError" class="mb-4" />

    <MessageBox v-if="hasCredentialError" class="mb-4">
      {{ t('login.wrongCredentials') }}
    </MessageBox>

    <AppButton
      variant="link"
      :disabled="isFormInvalid || loading"
      type="submit"
      class="w-full"
      @click="submitLogin(router, redirectTo)"
      >{{ t('login.login') }}</AppButton
    >
  </form>
</template>

<script lang="ts" setup>
import AppInput from '../../../components/forms/AppInput.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { errorGenerator } from '../../../utils/form-error-generator';
import { useLogin } from './use-login';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const redirectTo = route.query.redirectTo as string;

const {
  loginData,
  loginValidation,
  isFormInvalid,
  hasLoginFormError,
  hasCredentialError,
  submitLogin,
  loading,
} = useLogin();
</script>
