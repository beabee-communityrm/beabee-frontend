<route lang="yaml">
name: reset_password
meta:
  pageTitle: pageTitle.resetPassword
  layout: Auth
  noAuth: true
</route>

<template>
  <AuthBox>
    <form @submit.prevent>
      <AppTitle>
        {{ mode === 'set' ? t('setPassword.title') : t('resetPassword.title') }}
      </AppTitle>

      <div class="mb-5">
        <p class="font-semibold">
          {{
            mode === 'set'
              ? t('setPassword.description')
              : t('resetPassword.description')
          }}
        </p>
      </div>

      <div class="mb-5">
        <AppInput
          v-model="data.password"
          :label="t('resetPassword.newPassword')"
          :info-message="t('form.passwordInfo')"
          type="password"
          name="password"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="mb-6">
        <AppInput
          v-model="data.repeatPassword"
          :label="t('resetPassword.confirmPassword')"
          type="password"
          name="confirmPassword"
          autocomplete="new-password"
          :same-as="data.password"
          required
        />
      </div>

      <div class="mb-3">
        <AppInput
          v-if="hasMFAEnabled"
          v-model="data.token"
          type="text"
          name="verifyCode"
          required
          min="6"
          max="6"
          :label="t('accountPage.mfa.codeInput.label')"
        />
      </div>

      <AppNotification
        v-if="hasError && !errorCode"
        variant="error"
        class="mb-4"
        :title="t('resetPassword.errorTitle')"
      >
        <p>
          <i18n-t keypath="resetPassword.errorText">
            <template #newLink>
              <router-link to="/auth/forgot-password" class="underline">{{
                t('resetPassword.errorLink')
              }}</router-link>
            </template>
          </i18n-t>
        </p>
      </AppNotification>

      <AppNotification
        v-if="errorCode === RESET_SECURITY_FLOW_ERROR_CODE.MFA_TOKEN_REQUIRED"
        variant="info"
        class="mb-4"
        :title="t('resetPassword.errorTitles.' + errorCode)"
      >
        <p>{{ t('resetPassword.errors.' + errorCode) }}</p>
      </AppNotification>

      <AppNotification
        v-if="
          errorCode &&
          errorCode !== RESET_SECURITY_FLOW_ERROR_CODE.MFA_TOKEN_REQUIRED
        "
        variant="error"
        class="mb-4"
        :title="t('resetPassword.errorTitle')"
      >
        <p>{{ t('resetPassword.errors.' + errorCode) }}</p>
      </AppNotification>

      <AppButton
        variant="link"
        :disabled="validation.$invalid || loading"
        class="mb-4 w-full"
        type="submit"
        @click="handleSubmit"
        >{{
          mode === 'set' ? t('common.login') : t('resetPassword.changePassword')
        }}</AppButton
      >

      <div v-if="mode === 'reset'" class="text-center">
        <router-link
          variant="link"
          to="/auth/login"
          class="font-semibold text-link underline"
          >{{ t('resetPassword.login') }}</router-link
        >
      </div>
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
import AppNotification from '@components/AppNotification.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';

import ResetSecurityFlowService from '@utils/api/reset-security-flow.service';
import { isInternalUrl } from '@utils/index';
import { isRequestError } from '@utils/api';

import { updateCurrentUser } from '@store/index';
import { addNotification } from '@store/notifications';

import { RESET_SECURITY_FLOW_ERROR_CODE } from '@enums/reset-security-flow-error-code';

const props = withDefaults(
  defineProps<{
    id: string;
    mode?: 'set' | 'reset';
  }>(),
  { mode: 'reset' }
);

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const redirectTo = route.query.next as string | undefined;

const loading = ref(false);
const errorCode = ref(RESET_SECURITY_FLOW_ERROR_CODE.NONE);
const hasError = ref(false);
const hasMFAEnabled = ref(false);
const data = reactive({ password: '', repeatPassword: '', token: '' });

const validation = useVuelidate();

const onError = (err: unknown) => {
  if (
    isRequestError(
      err,
      [
        RESET_SECURITY_FLOW_ERROR_CODE.MFA_TOKEN_REQUIRED,
        RESET_SECURITY_FLOW_ERROR_CODE.INVALID_TOKEN,
      ],
      [401, 403]
    )
  ) {
    errorCode.value = err.response.data.code;
    hasMFAEnabled.value = true;
    return;
  }

  // Unknown / unhanded errors
  throw err;
};

async function handleSubmit() {
  loading.value = true;
  hasError.value = false;

  try {
    await ResetSecurityFlowService.resetPasswordComplete(
      props.id,
      data.password,
      data.token || undefined
    );
    await updateCurrentUser();

    if (isInternalUrl(redirectTo)) {
      // TODO: use router when legacy app is gone
      window.location.href = redirectTo;
    } else {
      addNotification({
        variant: 'success',
        title: t('resetPassword.success'),
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
