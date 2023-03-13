<route lang="yaml">
name: forgot-password
meta:
  layout: Auth
  pageTitle: pageTitle.forgotPassword
  noAuth: true
</route>

<template>
  <form @submit.prevent>
    <h1 class="mb-6 text-2.5xl">{{ t('forgotPassword.title') }}</h1>

    <template v-if="!isRequestSuccessful">
      <div class="mb-2">
        <p class="font-semibold">{{ t('forgotPassword.description') }}</p>
      </div>

      <div class="mb-5">
        <AppInput
          v-model="forgotPasswordData.email"
          type="email"
          name="email"
          required
        />
      </div>

      <AppButton
        variant="link"
        :disabled="validation.$invalid || loading"
        type="submit"
        class="w-full"
        @click="submitForgotPassword"
        >{{ t('forgotPassword.resetPassword') }}</AppButton
      >
    </template>

    <template v-else>
      <!-- TODO: fix by adding appropriate formatting -->
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
</template>

<script lang="ts" setup>
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/button/AppButton.vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { reactive, ref } from 'vue';
import { forgotPassword } from '../../utils/api/auth';

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
