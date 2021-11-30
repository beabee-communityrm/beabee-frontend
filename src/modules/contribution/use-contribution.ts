import { computed, reactive, ref, watch } from 'vue';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import {
  fetchJoinContent,
  fetchContribution,
  createContribution,
  updateContribution,
  updatePaymentSource as updateBankAccount,
  cancelContribution,
} from './contribution.service';
import {
  ContributionContent,
  CurrentContribution,
  NewContribution,
  PaymentSource,
  Periods,
  ContributionType,
  MembershipStatus,
} from './contribution.interface';
import i18n from '../../i18n';
import { Router, useRoute } from 'vue-router';

const { t } = i18n.global;

const currentContribution = reactive<CurrentContribution>({
  amount: 0,
  period: ContributionPeriod.Monthly,
  type: ContributionType.None,
  membershipExpiryDate: '',
  cancellationDate: '',
  membershipStatus: MembershipStatus.None,
});

const paymentSource = reactive<PaymentSource>({
  type: '',
  bankName: '',
  accountHolderName: '',
  accountNumberEnding: '',
});

const newContribution = reactive<NewContribution>({
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
});

const hasPaymentSource = computed(() => paymentSource.type);

const setCurrentContribution = () => {
  const id = useRoute().params.id as string;
  fetchContribution(id)
    .then(({ data }) => {
      currentContribution.amount = data.amount;
      currentContribution.period = data.period;
      currentContribution.type = data.type;
      currentContribution.membershipExpiryDate = data.membershipExpiryDate;
      currentContribution.cancellationDate = data.cancellationDate;
      currentContribution.membershipStatus = data.membershipStatus;

      newContribution.amount = data.amount;
      newContribution.period = data.period;
      // TODO: sync payFee too

      if (data.paymentSource) {
        paymentSource.type = data.paymentSource.type;
        paymentSource.bankName = data.paymentSource.bankName;
        paymentSource.accountHolderName = data.paymentSource.accountHolderName;
        paymentSource.accountNumberEnding =
          data.paymentSource.accountNumberEnding;
      }
    })
    .catch((err) => err);
};
const contributionLoading = ref(false);

const submitCreateContribution = (id?: string) => {
  contributionLoading.value = true;
  createContribution(newContribution, id)
    .then(({ data }) => {
      window.location.href = data.redirectUrl;
    })
    .catch((err) => err)
    .finally(() => (contributionLoading.value = false));
};

const submitUpdateContribution = (id?: string) => {
  contributionLoading.value = true;
  updateContribution(
    {
      amount: newContribution.amount,
      payFee: newContribution.payFee,
    },
    id
  )
    .then(({ data }) => {
      currentContribution.amount = data.amount;
      currentContribution.period = data.period;
      // TODO: to do somthing here, like showing succes message? (ask the design team)
    })
    .catch((err) => err)
    .finally(() => (contributionLoading.value = false));
};

const submitContribution = (id?: string) => {
  if (isActiveMemberWithGoCardless.value) {
    submitUpdateContribution(id);
  } else {
    submitCreateContribution(id);
  }
};

const contributionContent = reactive<ContributionContent>({
  initialAmount: 5,
  initialPeriod: '',
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
});

const setContributionContent = () => {
  // TODO: currently contribution content is part of
  // join content API.
  fetchJoinContent()
    .then(({ data }) => {
      contributionContent.initialAmount = data.initialAmount;
      contributionContent.initialPeriod = data.initialPeriod;
      contributionContent.minMonthlyAmount = data.minMonthlyAmount;
      contributionContent.periods = data.periods;
      contributionContent.showAbsorbFee = data.showAbsorbFee;
    })
    .catch((err) => err);
};

const cantUpdatePaymentSource = ref(false);
const paymentSourceLoading = ref(false);

const updatePaymentSource = (id?: string) => {
  paymentSourceLoading.value = true;
  updateBankAccount(id)
    .then(({ data }) => {
      window.location.href = data.redirectUrl;
    })
    .catch((err) => {
      // Only revert loading on error as success causes route change
      paymentSourceLoading.value = false;
      if (
        err.response?.status === 400 &&
        err.response?.data.code === 'cant-update-contribution'
      ) {
        cantUpdatePaymentSource.value = true;
      }
    });
};

// - TODO: improvement: remove logic duplication between
// contribution page and join page
const fee = computed(() => {
  return (newContribution.amount + 20) / 100;
});

const minAmount = computed(() => {
  const { minMonthlyAmount } = contributionContent;
  return isMonthly.value ? minMonthlyAmount : minMonthlyAmount * 12;
});

const definedAmounts = computed(() => {
  const selectedPeriod = contributionContent.periods.find((period: Periods) => {
    return period.name === newContribution.period;
  });
  return selectedPeriod?.presetAmounts as number[];
});

const changePeriod = (period: ContributionPeriod) => {
  newContribution.period = period;
  // reset the selected amount after period change
  newContribution.amount = definedAmounts.value[0];
};

const shouldForceFee = computed(() => {
  return newContribution.amount === 1 && isMonthly.value;
});
watch(shouldForceFee, (force) => {
  if (force) newContribution.payFee = true;
});

const isContributionFormInvalid = computed(() => {
  return newContribution.amount < minAmount.value;
});

const isMonthly = computed(() => newContribution.period === 'monthly');
// end of todo

const period = computed(() =>
  t(isMonthly.value ? 'common.month' : 'common.year')
);

const hasGoCardlessType = computed(
  () => currentContribution.type === ContributionType.GoCardless
);
const isActiveMemberWithGoCardless = computed(
  () => isActiveMember.value && hasGoCardlessType.value
);
const isActiveMember = computed(
  () => currentContribution.membershipStatus === MembershipStatus.Active
);
const isAnnualMember = computed(
  () => currentContribution.period === ContributionPeriod.Annually
);
const hasManualPayment = computed(
  () => currentContribution.type === ContributionType.Manual
);
const isExpiringMember = computed(
  () => currentContribution.membershipStatus === MembershipStatus.Expiring
);
const isExpiredMember = computed(
  () => currentContribution.membershipStatus === MembershipStatus.Expired
);

const contributionButtonText = computed(() => {
  if (hasManualPayment.value) return t('contribution.updatePaymentType');
  else if (isActiveMember.value) return t('contribution.updateContribution');
  else if (isExpiringMember.value) return t('contribution.restartContribution');
  return t('contribution.startContribution');
});

const showContributionForm = computed(() => {
  return !isAnnualMember.value || isExpiredMember.value;
});

const showCancelContribution = computed(() => {
  return hasGoCardlessType.value && isActiveMember.value;
});

const cancelContributionLoading = ref(false);
const submitCancelContribution = (router: Router, id?: string) => {
  cancelContributionLoading.value = true;
  cancelContribution(id)
    .then(() => {
      if (id) {
        router.push(`/contacts/${id}/contribution`);
      } else {
        router.push('/profile/contribution');
      }
    })
    .catch((err) => err)
    .finally(() => (cancelContributionLoading.value = false));
};

export function useContribution() {
  return {
    newContribution,
    currentContribution,
    setCurrentContribution,
    contributionContent,
    setContributionContent,
    isContributionFormInvalid,
    isMonthly,
    changePeriod,
    shouldForceFee,
    minAmount,
    definedAmounts,
    fee,
    submitContribution,
    hasManualPayment,
    contributionButtonText,
    paymentSourceLoading,
    updatePaymentSource,
    isActiveMemberWithGoCardless,
    hasPaymentSource,
    showContributionForm,
    showCancelContribution,
    paymentSource,
    cantUpdatePaymentSource,
    contributionLoading,
    submitCancelContribution,
    cancelContributionLoading,
    period,
  };
}
