import { computed, reactive, ref } from 'vue';
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
  CurrentContribution,
  PaymentSource,
  ContributionType,
  MembershipStatus,
} from './contribution.interface';
import i18n from '../../i18n';
import { useRouter } from 'vue-router';
import {
  ContributionContent,
  ContributionData,
} from '../../components/contribution/contribution.interface';

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

const newContribution = reactive<ContributionData>({
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,

  // TODO: Can we move this?
  get totalAmount(): number {
    return this.payFee && this.period === ContributionPeriod.Monthly
      ? this.amount + this.fee
      : this.amount;
  },
  get fee(): number {
    return (this.amount + 20) / 100;
  },
});

const contributionContent = reactive<ContributionContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
});

const hasPaymentSource = computed(() => paymentSource.type);

const isIniting = ref(false);
const cantUpdatePaymentSource = ref(false);

const initContributionPage = async () => {
  isIniting.value = true;
  cantUpdatePaymentSource.value = false;

  const contrib = (await fetchContribution()).data;
  currentContribution.amount = contrib.amount;
  currentContribution.period = contrib.period;
  currentContribution.type = contrib.type;
  currentContribution.membershipExpiryDate = contrib.membershipExpiryDate;
  currentContribution.cancellationDate = contrib.cancellationDate;
  currentContribution.membershipStatus = contrib.membershipStatus;

  if (currentContribution.type !== ContributionType.None) {
    newContribution.amount = contrib.amount;
    newContribution.period = contrib.period;
    // TODO: sync payFee too
  }

  if (contrib.paymentSource) {
    paymentSource.type = contrib.paymentSource.type;
    paymentSource.bankName = contrib.paymentSource.bankName;
    paymentSource.accountHolderName = contrib.paymentSource.accountHolderName;
    paymentSource.accountNumberEnding =
      contrib.paymentSource.accountNumberEnding;
  }

  // TODO: currently contribution content is part of
  // join content API.
  const content = (await fetchJoinContent()).data;
  contributionContent.initialAmount = content.initialAmount;
  contributionContent.initialPeriod = content.initialPeriod;
  contributionContent.minMonthlyAmount = content.minMonthlyAmount;
  contributionContent.periods = content.periods;
  contributionContent.showAbsorbFee = content.showAbsorbFee;

  if (!contributionContent.showAbsorbFee) {
    newContribution.payFee = false;
  }

  isIniting.value = false;
};

const submitCreateContribution = () => {
  return createContribution(newContribution).then(({ data }) => {
    window.location.href = data.redirectUrl;
  });
};

const submitUpdateContribution = () => {
  return updateContribution(newContribution).then(({ data }) => {
    currentContribution.amount = data.amount;
    currentContribution.period = data.period;
    // TODO: to do somthing here, like showing succes message? (ask the design team)
  });
};

const submitContributionLoading = ref(false);

const submitContribution = async () => {
  submitContributionLoading.value = true;

  const submitAction = isActiveMemberWithGoCardless.value
    ? submitUpdateContribution()
    : submitCreateContribution();

  submitAction
    .catch((err) => err)
    .finally(() => (submitContributionLoading.value = false));
};

const paymentSourceLoading = ref(false);

const updatePaymentSource = () => {
  paymentSourceLoading.value = true;
  updateBankAccount()
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

const period = computed(() =>
  t(
    newContribution.period === ContributionPeriod.Monthly
      ? 'common.month'
      : 'common.year'
  )
);

const hasNoneType = computed(
  () => currentContribution.type === ContributionType.None
);

const hasManualType = computed(
  () => currentContribution.type === ContributionType.Manual
);
const isActiveMember = computed(
  () => currentContribution.membershipStatus === MembershipStatus.Active
);
const isActiveMemberWithGoCardless = computed(
  () =>
    isActiveMember.value &&
    currentContribution.type === ContributionType.GoCardless
);
const isExpiringMember = computed(
  () => currentContribution.membershipStatus === MembershipStatus.Expiring
);

const contributionButtonText = computed(() => {
  if (hasManualType.value) return t('contribution.updatePaymentType');
  else if (isActiveMember.value) return t('contribution.updateContribution');
  else if (isExpiringMember.value) return t('contribution.restartContribution');
  return t('contribution.startContribution');
});

const showContributionForm = computed(() => {
  return (
    currentContribution.type === ContributionType.Manual ||
    currentContribution.period !== ContributionPeriod.Annually ||
    currentContribution.membershipStatus === MembershipStatus.Expired
  );
});

const cancelContributionLoading = ref(false);
const submitCancelContribution = () => {
  cancelContributionLoading.value = true;
  cancelContribution()
    .then(() => {
      useRouter().push('/profile/contribution');
    })
    .catch((err) => err)
    .finally(() => (cancelContributionLoading.value = false));
};

export function useContribution() {
  return {
    isIniting,
    initContributionPage,
    newContribution,
    currentContribution,
    contributionContent,
    submitContribution,
    submitContributionLoading,
    hasNoneType,
    hasManualType,
    contributionButtonText,
    paymentSourceLoading,
    updatePaymentSource,
    isActiveMemberWithGoCardless,
    hasPaymentSource,
    showContributionForm,
    paymentSource,
    period,
    cantUpdatePaymentSource,
    submitCancelContribution,
    cancelContributionLoading,
  };
}
