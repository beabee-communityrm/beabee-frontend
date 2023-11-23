<route lang="yaml">
name: reset_password
meta:
  pageTitle: pageTitle.resetPassword
  layout: Auth
  noAuth: true
</route>

<template>
  <AuthBox>
    <AppForm
      :button-text="
        mode === 'set' ? t('common.login') : t('resetPassword.changePassword')
      "
      :error-text="{
        [RESET_SECURITY_FLOW_ERROR_CODE.OTHER_ACTIVE_FLOW]: t(
          'resetPassword.errors.other-active-flow'
        ),
        [RESET_SECURITY_FLOW_ERROR_CODE.INVALID_TOKEN]: t(
          'resetPassword.errors.invalid-token'
        ),
        unknown: t('resetPassword.errorText'),
      }"
      inline-error
      full-button
      @submit="handleSubmit"
    >
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

      <template v-if="hasMFAEnabled">
        <div class="mb-3">
          <AppInput
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
          variant="info"
          class="mb-4"
          :title="t('resetPassword.errorTitles.mfa-token-required')"
        >
          <p>{{ t('resetPassword.errors.mfa-token-required') }}</p>
        </AppNotification>
      </template>
    </AppForm>

    <div v-if="mode === 'reset'" class="mb-4 text-center">
      <router-link
        variant="link"
        to="/auth/login"
        class="font-semibold text-link underline"
        >{{ t('resetPassword.login') }}</router-link
      >
    </div>
  </AuthBox>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import AppInput from '@components/forms/AppInput.vue';
import AppNotification from '@components/AppNotification.vue';
import AppTitle from '@components/AppTitle.vue';
import AuthBox from '@components/AuthBox.vue';
import AppForm from '@components/forms/AppForm.vue';

import { resetPasswordComplete } from '@utils/api/reset-security-flow';
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

const hasMFAEnabled = ref(false);
const data = reactive({ password: '', repeatPassword: '', token: '' });

async function handleSubmit() {
  try {
    await resetPasswordComplete(
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
    if (
      isRequestError(
        err,
        [RESET_SECURITY_FLOW_ERROR_CODE.MFA_TOKEN_REQUIRED],
        [401, 403]
      )
    ) {
      hasMFAEnabled.value = true;
    } else {
      // Unknown / unhanded errors
      throw err;
    }
  }
}
</script>
