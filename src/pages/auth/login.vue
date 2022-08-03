<route lang="yaml">
name: login
meta:
  pageTitle: pageTitle.login
  layout: Auth
  noAuth: true
</route>

<template>
  <form @submit.prevent>
    <h1 class="text-2.5xl font-title mb-2">{{ t('login.title') }}</h1>

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
      @click="submitLogin(redirectTo)"
      >{{ t('login.login') }}</AppButton
    >
  </form>
</template>

<script lang="ts" setup>
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/forms/AppButton.vue';
import MessageBox from '../../components/MessageBox.vue';
import { errorGenerator } from '../../utils/form-error-generator';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import { emailValidationRule } from '../../utils/form-validation/rules';
import isInternalUrl from '../../utils/is-internal-url';
import { updateCurrentUser } from '../../store';
import { LoginData } from '../../utils/api/api.interface';
import { login } from '../../utils/api/auth';

const { t } = useI18n();

const route = useRoute();
const redirectTo = route.query.next as string | undefined;

const loading = ref(false);

const loginData = reactive<LoginData>({
  email: '',
  password: '',
});

const loginRules = computed(() => ({
  email: emailValidationRule,
  password: {
    required: helpers.withMessage(t('form.errors.password.required'), required),
  },
}));

const isFormInvalid = computed(() => {
  return loginValidation.value.$invalid;
});

const hasLoginFormError = computed(() => {
  return loginValidation.value.$errors.length;
});

const loginValidation = useVuelidate(loginRules, loginData);

const hasCredentialError = ref(false);

const submitLogin = async (redirectTo?: string) => {
  loading.value = true;
  hasCredentialError.value = false;
  login(loginData)
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
