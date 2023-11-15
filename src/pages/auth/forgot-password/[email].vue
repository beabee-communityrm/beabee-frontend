<route lang="yaml">
name: forgot-password
meta:
  layout: Auth
  pageTitle: pageTitle.forgotPassword
  noAuth: true
</route>

<template>
  <AuthBox>
    <form @submit.prevent>
      <AppTitle>{{ t('forgotPassword.title') }}</AppTitle>

      <template v-if="!isRequestSuccessful">
        <p class="mb-4">{{ t('forgotPassword.description') }}</p>

        <div class="mb-4">
          <AppInput
            v-model="email"
            type="email"
            name="email"
            :label="t('form.email')"
            required
          />
        </div>

        <AppNotification
          v-if="errorCode"
          variant="error"
          class="mb-4"
          :title="t('forgotPassword.errorTitle')"
        >
          <p>{{ t('forgotPassword.errors.' + errorCode) }}</p>
        </AppNotification>

        <AppButton
          variant="link"
          :disabled="validation.$invalid || loading"
          type="submit"
          class="w-full mb-2"
          @click="submitForgotPassword"
        >
          {{ t('forgotPassword.resetPassword') }}
        </AppButton>

        <div class="text-center">
          <AppButton to="/auth/login" variant="text" size="sm">
            {{ t('forgotPassword.backToLogin') }}
          </AppButton>
        </div>
      </template>

      <template v-else>
        <p class="mb-5 rounded bg-primary-10 p-4">
          <i18n-t keypath="forgotPassword.message">
            <template #email>
              <b>{{ email }}</b>
            </template>
          </i18n-t>
          <br />
          {{ t('forgotPassword.checkInbox') }}
        </p>

        <AppButton class="w-full" variant="link" to="/auth/login">{{
          t('login.login')
        }}</AppButton>
      </template>
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';

import AppInput from '@components/forms/AppInput.vue';
import AppButton from '@components/button/AppButton.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';
import AppNotification from '@components/AppNotification.vue';

import ResetSecurityFlowService from '@utils/api/reset-security-flow.service';
import { isRequestError } from '@utils/api';

import { RESET_SECURITY_FLOW_ERROR_CODE } from '@enums/reset-security-flow-error-code';

const { t } = useI18n();

const loading = ref(false);
const errorCode = ref(RESET_SECURITY_FLOW_ERROR_CODE.NONE);
const isRequestSuccessful = ref(false);

const props = withDefaults(
  defineProps<{
    email: string;
  }>(),
  {
    email: '',
  }
);

const email = ref(props.email);
const validation = useVuelidate();

const onError = (err: unknown) => {
  if (isRequestError(err, undefined, [403])) {
    const code = err.response?.data?.code;
    if (code === RESET_SECURITY_FLOW_ERROR_CODE.OTHER_ACTIVE_FLOW) {
      errorCode.value = code as RESET_SECURITY_FLOW_ERROR_CODE;
      return;
    }
  }

  // Unknown / unhanded errors
  throw err;
};

const submitForgotPassword = async () => {
  loading.value = true;
  errorCode.value = RESET_SECURITY_FLOW_ERROR_CODE.NONE;
  try {
    await ResetSecurityFlowService.resetPasswordBegin(email.value);
    isRequestSuccessful.value = true;
  } catch (err) {
    onError(err);
    loading.value = false;
    return;
  } finally {
    loading.value = false;
  }
};
</script>
