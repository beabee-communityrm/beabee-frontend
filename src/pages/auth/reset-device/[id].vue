<route lang="yaml">
name: reset_device
meta:
  pageTitle: pageTitle.resetDevice
  layout: Auth
  noAuth: true
</route>

<template>
  <AuthBox>
    <AppForm
      :button-text="t('resetDevice.deleteDevice')"
      :success-text="t('resetDevice.success')"
      :error-text="{
        [RESET_SECURITY_FLOW_ERROR_CODE.INVALID_PASSWORD]: t(
          'resetDevice.errors.invalid-password'
        ),
        unknown: t('resetDevice.errorText'),
      }"
      inline-error
      full-button
      @submit="handleSubmit"
    >
      <AppTitle class="mb-2">
        {{ t('resetDevice.title') }}
      </AppTitle>

      <div class="mb-5">
        <p class="font-semibold">
          {{ t('resetDevice.description') }}
        </p>
      </div>

      <div class="mb-5">
        <AppInput
          v-model="data.password"
          :label="t('form.password')"
          type="password"
          name="password"
          autocomplete="current-password"
          required
        />
      </div>
    </AppForm>
  </AuthBox>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import AppInput from '@components/forms/AppInput.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';

import { resetDeviceComplete } from '@utils/api/reset-security-flow';
import { updateCurrentUser } from '@store/index';
import { isInternalUrl } from '@utils/index';

import AppForm from '@components/forms/AppForm.vue';

import { RESET_SECURITY_FLOW_ERROR_CODE } from '@enums/reset-security-flow-error-code';

const props = defineProps<{ id: string }>();

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const redirectTo = route.query.next as string | undefined;

const data = reactive({ password: '' });

async function handleSubmit() {
  await resetDeviceComplete(props.id, data.password);
  await updateCurrentUser();
  if (isInternalUrl(redirectTo)) {
    // TODO: use router when legacy app is gone
    window.location.href = redirectTo;
  } else {
    router.push({ path: '/' });
  }
}
</script>
