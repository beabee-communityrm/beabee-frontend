import { parseISO } from 'date-fns';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
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
  ContributionInfo,
  ContributionType,
  MembershipStatus,
  UpdateContribution,
} from './contribution.interface';
import i18n from '../../i18n';
import { ContributionContent } from '../../components/contribution/contribution.interface';

const { t } = i18n.global;

const currentContribution = reactive<ContributionInfo>({
  type: ContributionType.None,
  membershipStatus: MembershipStatus.None,
});

const newContribution = reactive<UpdateContribution>({
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  prorate: true,

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

const isIniting = ref(false);
const cantUpdateContribution = ref(false);
const cantUpdatePaymentSource = ref(false);

function toDate(s: string | undefined): Date | undefined {
  return s ? parseISO(s) : undefined;
}

const initContributionPage = async () => {
  isIniting.value = true;
  cantUpdateContribution.value = false;
  cantUpdatePaymentSource.value = false;

  const contrib = (await fetchContribution()).data;
  currentContribution.type = contrib.type;
  currentContribution.amount = contrib.amount;
  currentContribution.nextAmount = contrib.nextAmount;
  currentContribution.period = contrib.period;
  currentContribution.cancellationDate = toDate(contrib.cancellationDate);
  currentContribution.renewalDate = toDate(contrib.renewalDate);
  currentContribution.paymentSource = contrib.paymentSource;
  currentContribution.payFee = contrib.payFee;
  currentContribution.hasPendingPayment = contrib.hasPendingPayment;
  currentContribution.membershipStatus = contrib.membershipStatus;
  currentContribution.membershipExpiryDate = toDate(
    contrib.membershipExpiryDate
  );

  if (currentContribution.type !== ContributionType.None) {
    newContribution.amount = contrib.amount;
    newContribution.period = contrib.period;
    newContribution.payFee = contrib.payFee;
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
  return updateContribution(newContribution)
    .then(({ data }) => {
      currentContribution.amount = data.amount;
      currentContribution.period = data.period;
      currentContribution.nextAmount = data.nextAmount;
      // TODO: to do somthing here, like showing succes message? (ask the design team)
    })
    .catch((err) => {
      if (
        err.response?.status === 400 &&
        err.response.data.code === 'cant-update-contribution'
      ) {
        cantUpdateContribution.value = true;
      }
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

const updatePaymentSourceLoading = ref(false);

const updatePaymentSource = () => {
  updatePaymentSourceLoading.value = true;
  updateBankAccount()
    .then(({ data }) => {
      window.location.href = data.redirectUrl;
    })
    .catch((err) => {
      // Only revert loading on error as success causes route change
      updatePaymentSourceLoading.value = false;
      if (
        err.response?.status === 400 &&
        err.response?.data.code === 'cant-update-contribution'
      ) {
        cantUpdatePaymentSource.value = true;
      }
    });
};

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

const showProrateOptions = computed(() => {
  return (
    currentContribution.period === ContributionPeriod.Annually &&
    currentContribution.amount !== newContribution.amount
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
    submitContributionLoading,
    submitContribution,
    cantUpdateContribution,
    hasNoneType,
    hasManualType,
    contributionButtonText,
    updatePaymentSourceLoading,
    updatePaymentSource,
    cantUpdatePaymentSource,
    isActiveMemberWithGoCardless,
    showProrateOptions,
    submitCancelContribution,
    cancelContributionLoading,
  };
}
