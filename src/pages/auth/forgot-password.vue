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
            v-model="forgotPasswordData.email"
            type="email"
            name="email"
            :label="t('form.email')"
            required
          />
        </div>

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
              <b>{{ forgotPasswordData.email }}</b>
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
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/button/AppButton.vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { reactive, ref } from 'vue';
import { forgotPassword } from '../../utils/api/auth';
import AppTitle from '../../components/AppTitle.vue';
import AuthBox from '../../components/AuthBox.vue';

const { t } = useI18n();

const loading = ref(false);
const isRequestSuccessful = ref(false);

const forgotPasswordData = reactive({
  email: '',
});

const validation = useVuelidate();

const submitForgotPassword = async () => {
  loading.value = true;
  forgotPassword(forgotPasswordData.email)
    .then(() => {
      isRequestSuccessful.value = true;
    })
    .catch((err) => err)
    .finally(() => {
      loading.value = false;
    });
};
</script>
