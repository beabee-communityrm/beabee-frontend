import { computed, reactive, ref } from '@vue/reactivity';
import useVuelidate from '@vuelidate/core';
import {
  SignUpData,
  Periods,
  JoinContentData,
  SetupContentData,
} from './join.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { helpers, required } from '@vuelidate/validators';
import {
  signUp,
  fetchMember,
  fetchJoinContent,
  fetchSetupContent,
} from './join.service';
import i18n from '../../../i18n';
import {
  emailValidationRule,
  passwordValidationRule,
} from '../../../utils/form-validation/rules';

const { t } = i18n.global;

const signUpData = reactive<SignUpData>({
  email: '',
  password: '',
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  completeUrl: import.meta.env.VITE_APP_BASE_URL + '/join/complete',
});

const joinContent = ref<JoinContentData>({
  currencySymbol: '',
  initialAmount: 5,
  initialPeriod: '',
  minMonthlyAmount: 5,
  name: '',
  periods: [] as Periods[],
  privacyLink: '',
  showAbsorbFee: true,
  subtitle: '',
  termsLink: '',
  title: '',
});

const setJoinContent = () => {
  fetchJoinContent()
    .then(({ data }) => {
      joinContent.value = data;
    })
    .catch((err) => err);
};

const memberData = reactive({
  email: '',
  firstName: '',
  lastName: '',
  profile: {
    newsletterStatus: false,
  },
});

const fee = computed(() => {
  return (signUpData.amount + 20) / 100;
});

// converts `signUpData.amount` to number because it might be
// an empty string and cause error (because it might come from an
// input element)
const totalAmount = computed(() =>
  signUpData.payFee ? +signUpData.amount + fee.value : +signUpData.amount
);

const isMonthly = computed(() => signUpData.period === 'monthly');

const minAmount = computed(() => {
  const { minMonthlyAmount } = joinContent.value;
  return isMonthly.value ? minMonthlyAmount : minMonthlyAmount * 12;
});

const isBelowThreshold = computed(() => signUpData.amount < minAmount.value);

const isJoinFormInvalid = computed(() => {
  return isBelowThreshold.value || joinValidation.value.$invalid;
});

const hasJoinError = computed(() => {
  return isBelowThreshold.value || joinValidation.value.$errors.length;
});

const joinRules = computed(() => ({
  email: emailValidationRule,
  password: passwordValidationRule,
}));

const setupRules = computed(() => ({
  email: emailValidationRule,
  firstName: {
    required: helpers.withMessage(
      t('form.errors.firstName.required'),
      required
    ),
  },
  lastName: {
    required: helpers.withMessage(t('form.errors.lastName.required'), required),
  },
}));

const joinValidation = useVuelidate(joinRules, signUpData);
const setupValidation = useVuelidate(setupRules, memberData);

const submitSignUp = () => {
  signUp(signUpData)
    .then(({ data }) => {
      window.location.href = data.redirectUrl;
    })
    .catch((err) => err);
};

const isSetupFormInvalid = computed(() => {
  return setupValidation.value.$invalid;
});

const hasSetupError = computed(() => {
  return setupValidation.value.$errors.length;
});

const definedAmounts = computed(() => {
  const selectedPeriod = joinContent.value.periods.find((period) => {
    return period.name === signUpData.period;
  });
  return selectedPeriod?.presetAmounts as number[];
});

const changePeriod = (period: ContributionPeriod) => {
  signUpData.period = period;
  // reset the selected amount after period change
  signUpData.amount = definedAmounts.value[0];
};

const setMemberData = () => {
  fetchMember()
    .then(({ data }) => {
      memberData.firstName = data.firstname;
      memberData.lastName = data.lastname;
      memberData.email = data.email;
      memberData.profile.newsletterStatus = data.profile.newsletterStatus;
    })
    .catch((err) => err);
};

const setupContent = reactive<SetupContentData>({
  welcome: '',
  newsletterText: '',
  newsletterOptIn: '',
  newsletterTitle: '',
  showNewsletterOptIn: true,
});

const setSetupContent = () => {
  fetchSetupContent()
    .then(({ data }) => {
      setupContent.welcome = data.welcome;
      setupContent.newsletterText = data.newsletterText;
      setupContent.newsletterOptIn = data.newsletterOptIn;
      setupContent.newsletterTitle = data.newsletterTitle;
      setupContent.showNewsletterOptIn = data.showNewsletterOptIn;
    })
    .catch((err) => err);
};

function useJoin() {
  return {
    signUpData,
    fee,
    totalAmount,
    isMonthly,
    isBelowThreshold,
    isJoinFormInvalid,
    hasJoinError,
    joinValidation,
    submitSignUp,
    memberData,
    setupValidation,
    isSetupFormInvalid,
    hasSetupError,
    joinContent,
    setJoinContent,
    definedAmounts,
    changePeriod,
    minAmount,
    setMemberData,
    setupContent,
    setSetupContent,
  };
}

export { useJoin };
