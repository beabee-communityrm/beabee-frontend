import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { computed, reactive, ref } from 'vue';
import { emailValidationRule } from '../../../utils/form-validation/rules';
import i18n from '../../../i18n';
import isInternalUrl from '../../../utils/is-internal-url';
import { updateCurrentUser } from '../../../store';
import { LoginData } from '../../../utils/api/api.interface';
import { login } from '../../../utils/api/auth';

const { t } = i18n.global;

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

export function useLogin() {
  return {
    loginData,
    loginValidation,
    isFormInvalid,
    hasLoginFormError,
    hasCredentialError,
    submitLogin,
    loading,
  };
}
