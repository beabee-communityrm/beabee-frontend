import { computed, reactive, ref, watch } from 'vue';
import { LocationQueryRaw } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import {
  SignUpData,
  JoinContentData,
  SetupContentData,
  MemberData,
} from './join.interface';
import { Periods } from '../../contribution/contribution.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { helpers, required } from '@vuelidate/validators';
import {
  signUp,
  fetchMember,
  fetchJoinContent,
  fetchSetupContent,
  updateMember,
} from './join.service';
import i18n from '../../../i18n';
import {
  emailValidationRule,
  passwordValidationRule,
} from '../../../utils/form-validation/rules';
import { NewsletterStaus } from './newsletter-status.enum';
import { Router } from 'vue-router';

const { t } = i18n.global;

const joinContent = ref<JoinContentData>({
  initialAmount: 5,
  initialPeriod: '',
  minMonthlyAmount: 5,
  name: '',
  periods: [] as Periods[],
  privacyLink: '',
  showAbsorbFee: true,
  showNoContribution: false,
  subtitle: '',
  termsLink: '',
  title: '',
});

const signUpData = reactive<SignUpData>({
  email: '',
  password: '',
  // for some reasons it can't get the value from
  // `joinContent.value.initialAmount`
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  noContribution: false,
});

const setJoinContent = (query: LocationQueryRaw) => {
  fetchJoinContent()
    .then(({ data }) => {
      joinContent.value = data;
      // for some reasons `signUpData.amount` can't get the value from
      // `joinContent.value.initialAmount`
      signUpData.amount = query.amount ? +query.amount : data.initialAmount;
      if (!data.showAbsorbFee) {
        signUpData.payFee = false;
      }
    })
    .catch((err) => err);
};

const memberData = reactive<MemberData>({
  email: '',
  firstName: '',
  lastName: '',
  profile: {
    newsletterStatus: false,
    deliveryOptIn: false,
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

const loading = ref(false);

const submitSignUp = (router: Router) => {
  loading.value = true;
  signUp(signUpData)
    .then(({ data }) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        router.push({ path: '/join/confirm-email' });
      }
    })
    .catch((err) => {
      // Only revert loading on error as success causes route change
      loading.value = false;
      return err;
    });
};

// this is a vuelidate instance
const addressValidation = ref<any>({});

const hasSetupError = computed(
  () =>
    // check errors exist in `addressValidation.value`
    // because it might not exist at first and causes error
    !!(
      setupValidation.value.$errors.length ||
      addressValidation.value.$errors?.length
    )
);

const completeSetup = async (router: Router) => {
  // addressValidation.value won't exist if address fields are hidden
  const isAddressCorrect =
    !addressValidation.value.$validate ||
    (await addressValidation.value.$validate());
  const isSetupCorrect = await setupValidation.value.$validate();
  if (!isAddressCorrect || !isSetupCorrect) return;

  loading.value = true;

  updateMember(
    memberData,
    setupContent.value.showNewsletterOptIn,
    setupContent.value.showMailOptIn
  )
    .then(() => {
      router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
    })
    .catch((err) => {
      // Only revert loading on error as success causes route change
      loading.value = false;
      return err;
    });
};

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
  return (
    joinContent.value.showAbsorbFee &&
    signUpData.amount === 1 &&
    isMonthly.value
  );
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
      memberData.profile.newsletterStatus =
        data.profile.newsletterStatus === NewsletterStaus.Subscribed
          ? true
          : false;
      memberData.profile.deliveryOptIn = data.profile.deliveryOptIn;
      memberData.addressLine1 = data.profile.deliveryAddress.line1;
      memberData.addressLine2 = data.profile.deliveryAddress.line2;
      memberData.cityOrTown = data.profile.deliveryAddress.city;
      memberData.postCode = data.profile.deliveryAddress.postcode;
    })
    .catch((err) => err);
};

const setupContent = ref<SetupContentData>({
  welcome: '',
  newsletterText: '',
  newsletterOptIn: '',
  newsletterTitle: '',
  showNewsletterOptIn: false,
  showMailOptIn: false,
  mailTitle: '',
  mailText: '',
  mailOptIn: '',
});

const setSetupContent = () => {
  fetchSetupContent()
    .then(({ data }) => {
      setupContent.value = data;
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
    loading,
    submitSignUp,
    memberData,
    setupValidation,
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
    addressValidation,
    completeSetup,
  };
}

export { useJoin };
