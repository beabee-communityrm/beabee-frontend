import useVuelidate from '@vuelidate/core';
import { helpers, sameAs } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import { passwordValidationRule } from '../../../utils/form-validation/rules';
import isInternalUrl from '../../../utils/is-internal-url';
import { resetPassword } from '../auth.service';
import { Router } from 'vue-router';
import i18n from '../../../i18n';

const { t } = i18n.global;

const loading = ref(false);

const resetPasswordData = reactive({
  password: '',
  repeatPassword: '',
});

const resetPasswordValidationRule = computed(() => ({
  password: passwordValidationRule,
  repeatPassword: {
    sameAsPassword: helpers.withMessage(
      t('form.errors.password.sameAs'),
      sameAs(resetPasswordData.password)
    ),
  },
}));

const resetPasswordValidation = useVuelidate(
  resetPasswordValidationRule,
  resetPasswordData
);

const isFormInvalid = computed(() => {
  return resetPasswordValidation.value.$invalid;
});

const submitResetPassword = async (
  resetPasswordFlowId: string,
  router: Router,
  redirectTo?: string
) => {
  loading.value = true;
  resetPassword(resetPasswordData.password, resetPasswordFlowId)
    .then(() => {
      localStorage.setItem('isAuthenticated', 'true');
      if (isInternalUrl(redirectTo)) {
        // TODO: use router when legacy app is gone
        window.location.href = redirectTo;
      } else {
        router.push({ path: '/profile', query: { passwordReset: 'true' } });
      }
    })
    .catch((err) => err)
    .finally(() => (loading.value = false));
};

export function useResetPassword() {
  return {
    loading,
    isFormInvalid,
    submitResetPassword,
    resetPasswordData,
    resetPasswordValidation,
  };
}
