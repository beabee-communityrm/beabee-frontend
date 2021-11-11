import useVuelidate from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import { emailValidationRule } from '../../../utils/form-validation/rules';
import { ForgotPasswordData } from '../auth.interface';
import { forgotPassword } from '../auth.service';

const loading = ref(false);
const isRequestSuccessful = ref(false);

const forgotPasswordData = reactive<ForgotPasswordData>({
  email: '',
  resetUrl: import.meta.env.VITE_APP_BASE_URL + '/auth/reset-password',
});

const forgotPasswordValidationRules = computed(() => ({
  email: emailValidationRule,
}));

const forgotPasswordValidation = useVuelidate(
  forgotPasswordValidationRules,
  forgotPasswordData
);

const isFormInvalid = computed(() => {
  return forgotPasswordValidation.value.$invalid;
});

const submitForgotPassword = async () => {
  loading.value = true;
  forgotPassword(forgotPasswordData)
    .then(() => {
      isRequestSuccessful.value = true;
    })
    .catch((err) => err)
    .finally(() => {
      loading.value = false;
    });
};

export function useForgotPassword() {
  return {
    loading,
    isFormInvalid,
    submitForgotPassword,
    forgotPasswordData,
    isRequestSuccessful,
    forgotPasswordValidation,
  };
}
