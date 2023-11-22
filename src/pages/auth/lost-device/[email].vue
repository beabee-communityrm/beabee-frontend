<route lang="yaml">
name: lost-device
meta:
  layout: Auth
  pageTitle: pageTitle.lostDevice
  noAuth: true
</route>

<template>
  <AuthBox>
    <form @submit.prevent>
      <AppTitle class="mb-2">{{ t('lostDevice.title') }}</AppTitle>

      <template v-if="!isRequestSuccessful">
        <p class="mb-4">{{ t('lostDevice.description') }}</p>

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
          :title="t('lostDevice.errorTitle')"
        >
          <p>{{ t('lostDevice.errors.' + errorCode) }}</p>
        </AppNotification>

        <AppButton
          variant="link"
          :disabled="validation.$invalid || loading"
          type="submit"
          class="w-full mb-2"
          @click="submitLostDevice"
        >
          {{ t('lostDevice.resetDevice') }}
        </AppButton>

        <div class="text-center">
          <AppButton to="/auth/login" variant="text" size="sm">
            {{ t('forgotPassword.backToLogin') }}
          </AppButton>
        </div>
      </template>

      <template v-else>
        <p class="mb-5 rounded bg-primary-10 p-4">
          {{ t('lostDevice.emailSent') }}
        </p>

        <AppButton class="w-full" variant="link" to="/auth/login">{{
          t('login.login')
        }}</AppButton>
      </template>
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

import AppInput from '@components/forms/AppInput.vue';
import AppButton from '@components/button/AppButton.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';
import AppNotification from '@components/AppNotification.vue';

import ResetSecurityFlow from '@utils/api/reset-security-flow.service';
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
  if (
    isRequestError(
      err,
      [RESET_SECURITY_FLOW_ERROR_CODE.OTHER_ACTIVE_FLOW],
      [403]
    )
  ) {
    errorCode.value = err.response.data.code;
    return;
  }

  // Unknown / unhanded errors
  throw err;
};

const submitLostDevice = async () => {
  loading.value = true;
  errorCode.value = RESET_SECURITY_FLOW_ERROR_CODE.NONE;
  try {
    await ResetSecurityFlow.resetDeviceBegin(email.value);
  } catch (error) {
    onError(error);
    isRequestSuccessful.value = false;
    loading.value = false;
    return;
  }

  isRequestSuccessful.value = true;
  loading.value = false;
};
</script>
