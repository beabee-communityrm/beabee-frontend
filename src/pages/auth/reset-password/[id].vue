<route lang="yaml">
name: reset_password
meta:
  pageTitle: pageTitle.resetPassword
  layout: Auth
  noAuth: true
</route>

<template>
  <form @submit.prevent>
    <h1 class="text-2.5xl mb-6">
      {{ mode === 'set' ? t('setPassword.title') : t('resetPassword.title') }}
    </h1>

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
        required
      />
    </div>

    <div class="mb-6">
      <AppInput
        v-model="data.repeatPassword"
        :label="t('resetPassword.confirmPassword')"
        type="password"
        name="confirmPassword"
        :same-as="data.password"
        required
      />
    </div>

    <MessageBox v-if="hasError" type="error" class="mb-4">
      <p>
        <i18n-t keypath="resetPassword.error">
          <template #newLink>
            <router-link to="/auth/forgot-password" class="underline">{{
              t('resetPassword.errorLink')
            }}</router-link>
          </template>
        </i18n-t>
      </p>
    </MessageBox>

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
        class="text-link underline font-semibold"
        >{{ t('resetPassword.login') }}</router-link
      >
    </div>
  </form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { resetPassword } from '../../../utils/api/auth';
import { updateCurrentUser } from '../../../store';
import isInternalUrl from '../../../utils/is-internal-url';
import MessageBox from '../../../components/MessageBox.vue';

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
const hasError = ref(false);
const data = reactive({ password: '', repeatPassword: '' });

const validation = useVuelidate();

async function handleSubmit() {
  loading.value = true;
  hasError.value = false;

  try {
    await resetPassword(data.password, props.id);
    await updateCurrentUser();
    if (isInternalUrl(redirectTo)) {
      // TODO: use router when legacy app is gone
      window.location.href = redirectTo;
    } else {
      router.push({ path: '/profile', query: { passwordReset: 'true' } });
    }
  } catch (err) {
    hasError.value = true;
  }

  loading.value = false;
}
</script>