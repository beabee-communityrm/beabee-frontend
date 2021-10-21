import { email, helpers, required } from '@vuelidate/validators';
import { passwordValidator } from './validators';
import i18n from '../../i18n';

const { t } = i18n.global;

const emailValidationRule = {
  required: helpers.withMessage(t('form.errors.email.required'), required),
  email: helpers.withMessage(t('form.errors.email.invalid'), email),
};

const passwordValidationRule = {
  required: helpers.withMessage(t('form.errors.password.required'), required),
  validPassword: helpers.withMessage(
    t('form.errors.password.invalid'),
    passwordValidator
  ),
};

export { emailValidationRule, passwordValidationRule };
