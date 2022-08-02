<template>
  <form @submit.prevent>
    <h1 class="text-2.5xl mb-6">
      {{ isSetPassword ? t('setPassword.title') : t('resetPassword.title') }}
    </h1>

    <div class="mb-5">
      <p class="font-semibold">
        {{
          isSetPassword
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
        input-type="password"
        :error-message="errorGenerator(validation, 'password')"
        @blur="validation.password.$touch"
      />
    </div>

    <div class="mb-6">
      <AppInput
        v-model="data.repeatPassword"
        :label="t('resetPassword.confirmPassword')"
        input-type="password"
        :error-message="errorGenerator(validation, 'repeatPassword')"
        @blur="validation.repeatPassword.$touch"
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
        isSetPassword ? t('common.login') : t('resetPassword.changePassword')
      }}</AppButton
    >

    <div v-if="!isSetPassword" class="text-center">
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
import AppInput from '../../../components/forms/AppInput.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { errorGenerator } from '../../../utils/form-error-generator';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { computed, reactive, ref } from 'vue';
import { passwordValidationRule } from '../../../utils/form-validation/rules';
import { helpers, sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { resetPassword } from '../../../utils/api/auth';
import { updateCurrentUser } from '../../../store';
import isInternalUrl from '../../../utils/is-internal-url';
import MessageBox from '../../../components/MessageBox.vue';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();

const isSetPassword = route.params.type === 'set';
const redirectTo = route.query.next as string | undefined;
const resetPasswordFlowId = route.params.id as string;

const loading = ref(false);
const hasError = ref(false);
const data = reactive({ password: '', repeatPassword: '' });

const rules = computed(() => ({
  password: passwordValidationRule,
  repeatPassword: {
    sameAsPassword: helpers.withMessage(
      t('form.errors.password.sameAs'),
      sameAs(data.password)
    ),
  },
}));

const validation = useVuelidate(rules, data);

async function handleSubmit() {
  loading.value = true;
  hasError.value = false;

  try {
    await resetPassword(data.password, resetPasswordFlowId);
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
