<route lang="yaml">
name: reset_device
meta:
  pageTitle: pageTitle.resetDevice
  layout: Auth
  noAuth: true
</route>

<template>
  <AuthBox>
    <form @submit.prevent>
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
          required
        />
      </div>

      <AppNotification
        v-if="hasError && !errorCode"
        variant="error"
        class="mb-4"
        :title="t('resetDevice.errorTitle')"
      >
        <p>
          <i18n-t keypath="resetDevice.errorText">
            <template #newLink>
              <router-link to="/auth/lost-device" class="underline">{{
                t('resetDevice.errorLink')
              }}</router-link>
            </template>
          </i18n-t>
        </p>
      </AppNotification>

      <AppNotification
        v-if="hasError && errorCode"
        variant="error"
        class="mb-4"
        :title="t('resetDevice.errorTitle')"
      >
        <p>{{ t('resetDevice.errors.' + errorCode) }}</p>
      </AppNotification>

      <AppButton
        variant="link"
        :disabled="validation.$invalid || loading"
        class="mb-4 w-full"
        type="submit"
        @click="handleSubmit"
        >{{ t('resetDevice.deleteDevice') }}</AppButton
      >
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

import AppInput from '@components/forms/AppInput.vue';
import AppButton from '@components/button/AppButton.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';
import AppNotification from '@components/AppNotification.vue';

import ResetSecurityFlowService from '@utils/api/reset-security-flow.service';
import { updateCurrentUser } from '@store/index';
import { isInternalUrl } from '@utils/index';
import { isRequestError } from '@utils/api';

import { addNotification } from '@store/notifications';

import { RESET_SECURITY_FLOW_ERROR_CODE } from '@enums/reset-security-flow-error-code';

const props = defineProps<{
  id: string;
}>();

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const redirectTo = route.query.next as string | undefined;

const loading = ref(false);
const errorCode = ref(RESET_SECURITY_FLOW_ERROR_CODE.NONE);
const hasError = ref(false);
const data = reactive({ password: '' });

const validation = useVuelidate();

const onError = (err: unknown) => {
  if (isRequestError(err, undefined, [401, 403])) {
    const code = err.response?.data?.code;
    if (code === RESET_SECURITY_FLOW_ERROR_CODE.INVALID_PASSWORD) {
      errorCode.value = code as RESET_SECURITY_FLOW_ERROR_CODE;
      return;
    }
  }

  // Unknown / unhanded errors
  throw err;
};

async function handleSubmit() {
  loading.value = true;
  hasError.value = false;

  try {
    await ResetSecurityFlowService.resetDeviceComplete(props.id, data.password);
    await updateCurrentUser();
    if (isInternalUrl(redirectTo)) {
      // TODO: use router when legacy app is gone
      window.location.href = redirectTo;
    } else {
      addNotification({
        variant: 'success',
        title: t('resetDevice.success'),
      });
      router.push({ path: '/' });
    }
  } catch (err) {
    onError(err);
    hasError.value = true;
    loading.value = false;
    return;
  }

  loading.value = false;
}
</script>
