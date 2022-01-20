import { computed, reactive, ref } from 'vue';
import { LocationQueryRaw } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { SetupMemberData, SignupData } from './join.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { helpers, required } from '@vuelidate/validators';
import i18n from '../../../i18n';
import {
  emailValidationRule,
  passwordValidationRule,
} from '../../../utils/form-validation/rules';
import { Router } from 'vue-router';
import {
  fetchJoinContent,
  fetchJoinSetupContent,
} from '../../../utils/api/content';
import { signUp } from '../../../utils/api/signup';
import {
  fetchMemberWithProfile,
  updateMember,
} from '../../../utils/api/member';
import { NewsletterStatus } from '../../../utils/enums/newsletter-status.enum';
import {
  JoinContent,
  JoinSetupContent,
  UpdateMemberData,
} from '../../../utils/api/api.interface';

const { t } = i18n.global;

const joinContent = ref<JoinContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  name: '',
  periods: [],
  privacyLink: '',
  showAbsorbFee: true,
  showNoContribution: false,
  subtitle: '',
  termsLink: '',
  title: '',
});

const signUpData = reactive<SignupData>({
  email: '',
  password: '',
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  noContribution: false,
  prorate: false,

  get totalAmount(): number {
    return this.payFee && this.period === ContributionPeriod.Monthly
      ? this.amount + this.fee
      : this.amount;
  },
  get fee(): number {
    return (this.amount + 20) / 100;
  },
});

const setJoinContent = (query: LocationQueryRaw) => {
  fetchJoinContent()
    .then((data) => {
      joinContent.value = data;
      signUpData.amount = query.amount ? +query.amount : data.initialAmount;
      if (!data.showAbsorbFee) {
        signUpData.payFee = false;
      }
    })
    .catch((err) => err);
};

const setupMemberData = reactive<SetupMemberData>({
  email: '',
  firstName: '',
  lastName: '',
  profile: {
    newsletterOptIn: false,
    deliveryOptIn: false,
  },
  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  postCode: '',
});

const isContributionValid = ref(false);

const isJoinFormInvalid = computed(() => {
  return !isContributionValid.value || joinValidation.value.$invalid;
});

const hasJoinError = computed(() => {
  return !isContributionValid.value || joinValidation.value.$errors.length;
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
const setupValidation = useVuelidate(setupRules, setupMemberData);

const loading = ref(false);

const submitSignUp = (router: Router) => {
  loading.value = true;
  signUp(signUpData)
    .then((data) => {
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

  const updateMemberData: UpdateMemberData = {
    email: setupMemberData.email,
    firstname: setupMemberData.firstName,
    lastname: setupMemberData.lastName,
  };

  if (
    setupMemberData.profile.newsletterOptIn ||
    setupContent.value.showMailOptIn
  ) {
    updateMemberData.profile = {
      ...(setupMemberData.profile.newsletterOptIn && {
        newsletterStatus: NewsletterStatus.Subscribed,
      }),
      ...(setupContent.value.showMailOptIn && {
        deliveryOptIn: setupMemberData.profile.deliveryOptIn,
        address: {
          line1: setupMemberData.addressLine1,
          line2: setupMemberData.addressLine2,
          city: setupMemberData.cityOrTown,
          postcode: setupMemberData.postCode,
        },
      }),
    };
  }

  updateMember(updateMemberData)
    .then(() => {
      router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
    })
    .catch((err) => {
      // Only revert loading on error as success causes route change
      loading.value = false;
      return err;
    });
};

const setMemberData = () => {
  fetchMemberWithProfile()
    .then((data) => {
      setupMemberData.firstName = data.firstname;
      setupMemberData.lastName = data.lastname;
      setupMemberData.email = data.email;
      setupMemberData.profile.newsletterOptIn =
        data.profile.newsletterStatus === NewsletterStatus.Subscribed
          ? true
          : false;
      setupMemberData.profile.deliveryOptIn = data.profile.deliveryOptIn;
      if (data.profile.deliveryAddress) {
        setupMemberData.addressLine1 = data.profile.deliveryAddress.line1;
        setupMemberData.addressLine2 = data.profile.deliveryAddress.line2 || '';
        setupMemberData.cityOrTown = data.profile.deliveryAddress.city;
        setupMemberData.postCode = data.profile.deliveryAddress.postcode;
      }
    })
    .catch((err) => err);
};

const setupContent = ref<JoinSetupContent>({
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
  fetchJoinSetupContent()
    .then((data) => {
      setupContent.value = data;
    })
    .catch((err) => err);
};

function useJoin() {
  return {
    signUpData,
    isContributionValid,
    isJoinFormInvalid,
    hasJoinError,
    joinValidation,
    loading,
    submitSignUp,
    setupMemberData,
    setupValidation,
    hasSetupError,
    joinContent,
    setJoinContent,
    setMemberData,
    setupContent,
    setSetupContent,
    addressValidation,
    completeSetup,
  };
}

export { useJoin };
