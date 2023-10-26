<route lang="yaml">
name: login
meta:
  pageTitle: pageTitle.login
  layout: Auth
  noAuth: true
</route>

<template>
  <AuthBox>
    <AppForm :button-text="t('login.login')" full-button @submit="submitLogin">
      <AppTitle class="mb-2">{{ t('login.title') }}</AppTitle>

      <div class="mb-5">
        <span>{{ t('login.notMember') }}</span>
        <router-link
          to="/join"
          class="ml-1 font-semibold text-link underline"
          >{{ t('login.joinNow') }}</router-link
        >
      </div>

      <div class="mb-5">
        <AppInput
          v-model="data.email"
          type="email"
          name="email"
          required
          :label="t('form.email')"
        />
      </div>

      <div class="mb-3">
        <AppInput
          v-model="data.password"
          type="password"
          name="password"
          required
          :label="t('form.password')"
        />
      </div>

      <div class="mb-4">
        <router-link class="text-sm underline" to="/auth/forgot-password">
          {{ t('login.forgotPassword') }}
        </router-link>
      </div>

      <AppNotification
        v-if="hasCredentialError"
        class="mb-4"
        variant="error"
        :title="t('login.wrongCredentials')"
      />

      <AppNotification
        v-if="hasMFAEnabled"
        class="mb-4"
        variant="info"
        :title="t('login.hasMFAEnabled')"
      />

      <AppNotification
        v-if="hasWrongMFAToken"
        class="mb-4"
        variant="error"
        :title="t('login.hasWrongMFAToken')"
      />
    </AppForm>
  </AuthBox>
</template>

<script lang="ts" setup>
import AppInput from '../../components/forms/AppInput.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { reactive, ref } from 'vue';
import { isInternalUrl } from '../../utils';
import { updateCurrentUser } from '../../store';
import { LoginData, LOGIN_CODES } from '../../utils/api/api.interface';
import { login } from '../../utils/api/auth';
import AppForm from '../../components/forms/AppForm.vue';
import AppNotification from '../../components/AppNotification.vue';
import AppTitle from '../../components/AppTitle.vue';
import AuthBox from '../../components/AuthBox.vue';

const { t } = useI18n();

const route = useRoute();
const redirectTo = route.query.next as string | undefined;

const loading = ref(false);

const data = reactive<LoginData>({
  email: '',
  password: '',
  token: '',
});

const hasCredentialError = ref(false);
const hasMFAEnabled = ref(false);
const hasWrongMFAToken = ref(false);

let emailBefore = '';

async function submitLogin() {
  loading.value = true;
  hasCredentialError.value = false;
  hasWrongMFAToken.value = false;

  // Only reset MFA if email changed
  if (emailBefore !== data.email) {
    hasMFAEnabled.value = false;
  }
  emailBefore = data.email;
  try {
    await login(data);
    await updateCurrentUser();
    // TODO: use router when legacy app is gone
    window.location.href = isInternalUrl(redirectTo) ? redirectTo : '/';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response?.status === 401) {
      if (err.response?.data?.code === LOGIN_CODES.REQUIRES_2FA) {
        hasMFAEnabled.value = true;
      } else if (err.response?.data?.code === LOGIN_CODES.INVALID_TOKEN) {
        hasWrongMFAToken.value = true;
      } else {
        hasCredentialError.value = true;
      }
    }
  } finally {
    loading.value = false;
  }
}
</script>
