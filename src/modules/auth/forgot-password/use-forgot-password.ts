import useVuelidate from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import { forgotPassword } from '../../../utils/api/auth';
import { emailValidationRule } from '../../../utils/form-validation/rules';

const loading = ref(false);
const isRequestSuccessful = ref(false);

const forgotPasswordData = reactive({
  email: '',
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
  forgotPassword(forgotPasswordData.email)
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
