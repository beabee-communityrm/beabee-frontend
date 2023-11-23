<route lang="yaml">
name: lost-device
meta:
  layout: Auth
  pageTitle: pageTitle.lostDevice
  noAuth: true
</route>

<template>
  <AuthBox>
    <AppTitle class="mb-2">{{ t('lostDevice.title') }}</AppTitle>

    <template v-if="!isRequestSuccessful">
      <AppForm
        :button-text="t('lostDevice.resetDevice')"
        :error-text="{
          [RESET_SECURITY_FLOW_ERROR_CODE.OTHER_ACTIVE_FLOW]: t(
            'lostDevice.errors.other-active-flow'
          ),
          unknown: t('lostDevice.errorText'),
        }"
        inline-error
        full-button
        @submit="submitLostDevice"
      >
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
      </AppForm>
    </template>

    <template v-else>
      <p class="rounded bg-primary-10 p-4">
        {{ t('lostDevice.emailSent') }}
      </p>
    </template>

    <div class="mt-2 text-center">
      <AppButton to="/auth/login" variant="text" size="sm">
        {{ t('forgotPassword.backToLogin') }}
      </AppButton>
    </div>
  </AuthBox>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import AppInput from '@components/forms/AppInput.vue';
import AppButton from '@components/button/AppButton.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';

import { resetDeviceBegin } from '@utils/api/reset-security-flow';

import { RESET_SECURITY_FLOW_ERROR_CODE } from '@enums/reset-security-flow-error-code';
import AppForm from '@components/forms/AppForm.vue';

const { t } = useI18n();
const route = useRoute();

const isRequestSuccessful = ref(false);

const email = ref(route.query.email?.toString() || '');

const submitLostDevice = async () => {
  await resetDeviceBegin(email.value);
  isRequestSuccessful.value = true;
};
</script>
