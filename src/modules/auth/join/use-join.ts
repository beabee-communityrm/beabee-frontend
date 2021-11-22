import { computed, reactive, ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import {
  SignUpData,
  JoinContentData,
  SetupContentData,
} from './join.interface';
import { Periods } from '../../contribution/contribution.interface';
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
  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  postCode: '',
});

const fee = computed(() => {
  return (signUpData.amount + 20) / 100;
});

// converts `signUpData.amount` to number because it might be
// an empty string and cause error (because it might come from an
// input element)
const totalAmount = computed(() =>
  signUpData.payFee && isMonthly.value
    ? +signUpData.amount + fee.value
    : +signUpData.amount
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

const hasAddressError = ref(false);
const isAddressInvalid = ref(false);

const isSetupFormInvalid = computed(() => {
  return setupValidation.value.$invalid || isAddressInvalid.value;
});

const hasSetupError = computed(() => {
  return setupValidation.value.$errors.length || hasAddressError.value;
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

const shouldForceFee = computed(() => {
  return signUpData.amount === 1 && isMonthly.value;
});
watch(shouldForceFee, (force) => {
  if (force) signUpData.payFee = true;
});

const setMemberData = () => {
  fetchMember()
    .then(({ data }) => {
      memberData.firstName = data.firstname;
      memberData.lastName = data.lastname;
      memberData.email = data.email;
      memberData.profile.newsletterStatus = data.profile.newsletterStatus;
      memberData.addressLine1 = data.profile.deliveryAddress.line1;
      memberData.addressLine2 = data.profile.deliveryAddress.line2;
      memberData.cityOrTown = data.profile.deliveryAddress.city;
      memberData.postCode = data.profile.deliveryAddress.postcode;
    })
    .catch((err) => err);
};

const setupContent = reactive<SetupContentData>({
  welcome: '',
  newsletterText: '',
  newsletterOptIn: '',
  newsletterTitle: '',
  showNewsletterOptIn: false,
  showMailOptIn: false,
});

const setSetupContent = () => {
  fetchSetupContent()
    .then(({ data }) => {
      setupContent.welcome = data.welcome;
      setupContent.newsletterText = data.newsletterText;
      setupContent.newsletterOptIn = data.newsletterOptIn;
      setupContent.newsletterTitle = data.newsletterTitle;
      setupContent.showNewsletterOptIn = data.showNewsletterOptIn;
      setupContent.showMailOptIn = data.showMailOptIn;
    })
    .catch((err) => err);
};

function useJoin() {
  return {
    signUpData,
    fee,
    totalAmount,
    isMonthly,
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
    shouldForceFee,
    minAmount,
    setMemberData,
    setupContent,
    setSetupContent,
    isAddressInvalid,
    hasAddressError,
  };
}

export { useJoin };
