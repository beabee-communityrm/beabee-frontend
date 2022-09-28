<route lang="yaml">
name: login
meta:
  pageTitle: pageTitle.login
  layout: Auth
  noAuth: true
</route>

<template>
  <form @submit.prevent>
    <h1 class="mb-2 font-title text-2.5xl">{{ t('login.title') }}</h1>

    <div class="mb-5">
      <span>{{ t('login.notMember') }}</span>
      <router-link to="/join" class="ml-1 font-semibold text-link underline">{{
        t('login.joinNow')
      }}</router-link>
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

    <div class="mb-8">
      <router-link class="text-xs underline" to="/auth/forgot-password">
        {{ t('login.forgotPassword') }}
      </router-link>
    </div>

    <MessageBox v-if="validation.$errors.length > 0" class="mb-4" />

    <MessageBox v-if="hasCredentialError" class="mb-4">
      {{ t('login.wrongCredentials') }}
    </MessageBox>

    <AppButton
      variant="link"
      :disabled="validation.$invalid || loading"
      type="submit"
      class="w-full"
      @click="submitLogin(redirectTo)"
      >{{ t('login.login') }}</AppButton
    >
  </form>
</template>

<script lang="ts" setup>
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/forms/AppButton.vue';
import MessageBox from '../../components/MessageBox.vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { reactive, ref } from 'vue';
import isInternalUrl from '../../utils/is-internal-url';
import { updateCurrentUser } from '../../store';
import { LoginData } from '../../utils/api/api.interface';
import { login } from '../../utils/api/auth';

const { t } = useI18n();

const route = useRoute();
const redirectTo = route.query.next as string | undefined;

const loading = ref(false);

const data = reactive<LoginData>({
  email: '',
  password: '',
});

const validation = useVuelidate();

const hasCredentialError = ref(false);

const submitLogin = async (redirectTo?: string) => {
  loading.value = true;
  hasCredentialError.value = false;
  login(data)
    .then(updateCurrentUser)
    .then(() => {
      // TODO: use router when legacy app is gone
      window.location.href = isInternalUrl(redirectTo) ? redirectTo : '/';
    })
    .catch((err) => {
      if (err.response?.status === 401) hasCredentialError.value = true;
    })
    .finally(() => (loading.value = false));
};
</script>
