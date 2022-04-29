import { computed, reactive, ref } from 'vue';
import { LocationQueryRaw } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { SignupData } from './join.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import {
  emailValidationRule,
  passwordValidationRule,
} from '../../../utils/form-validation/rules';
import { Router } from 'vue-router';
import { fetchJoinContent } from '../../../utils/api/content';
import { signUp } from '../../../utils/api/signup';
import { JoinContent } from '../../../utils/api/api.interface';

const joinContent = ref<JoinContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  showNoContribution: false,
  subtitle: '',
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

const setJoinContent = (query: LocationQueryRaw, hideContribution: boolean) => {
  fetchJoinContent()
    .then((data) => {
      joinContent.value = data;
      signUpData.amount = query.amount ? +query.amount : data.initialAmount;
      if (!data.showAbsorbFee) {
        signUpData.payFee = false;
      }
      if (hideContribution) {
        signUpData.noContribution = true;
      }
    })
    .catch((err) => err);
};

const isContributionValid = ref(true);

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

const joinValidation = useVuelidate(joinRules, signUpData);

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

function useJoin() {
  return {
    signUpData,
    isContributionValid,
    isJoinFormInvalid,
    hasJoinError,
    joinValidation,
    loading,
    submitSignUp,
    joinContent,
    setJoinContent,
    addressValidation,
  };
}

export { useJoin };
