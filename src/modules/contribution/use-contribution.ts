import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { ContributionType } from '../../utils/enums/contribution-type.enum';
import i18n from '../../i18n';
import { ContributionContent } from '../../components/contribution/contribution.interface';
import {
  cancelContribution,
  startContribution,
  fetchContribution,
  updateContribution,
  updatePaymentSource as updateBankAccount,
} from '../../utils/api/member';
import { MembershipStatus } from '../../utils/enums/membership-status.enum';
import { ContributionInfo } from '../../utils/api/api.interface';
import { fetchJoinContent } from '../../utils/api/content';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';

const { t } = i18n.global;

const currentContribution = reactive<ContributionInfo>({
  type: ContributionType.None,
  membershipStatus: MembershipStatus.None,
});

const newContribution = reactive({
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  prorate: true,
  // TODO
  paymentMethod: PaymentMethod.Card,
});

const contributionContent = reactive<ContributionContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  paymentMethods: [],
});

const isIniting = ref(false);
const cantUpdateContribution = ref(false);
const cantUpdatePaymentSource = ref(false);
const hasUpdatedContribution = ref(false);

const resetNewContribution = () => {
  newContribution.amount =
    currentContribution.amount || contributionContent.initialAmount;
  newContribution.period =
    currentContribution.period || contributionContent.initialPeriod;
  newContribution.payFee = contributionContent.showAbsorbFee
    ? !!currentContribution.payFee
    : false;
  newContribution.prorate = true;
};

const initContributionPage = async () => {
  isIniting.value = true;
  cantUpdateContribution.value = false;
  cantUpdatePaymentSource.value = false;
  hasUpdatedContribution.value = false;

  const contrib = await fetchContribution();
  currentContribution.type = contrib.type;
  currentContribution.amount = contrib.amount;
  currentContribution.nextAmount = contrib.nextAmount;
  currentContribution.period = contrib.period;
  currentContribution.cancellationDate = contrib.cancellationDate;
  currentContribution.renewalDate = contrib.renewalDate;
  currentContribution.paymentSource = contrib.paymentSource;
  currentContribution.payFee = contrib.payFee;
  currentContribution.hasPendingPayment = contrib.hasPendingPayment;
  currentContribution.membershipStatus = contrib.membershipStatus;
  currentContribution.membershipExpiryDate = contrib.membershipExpiryDate;

  const content = await fetchJoinContent();
  contributionContent.initialAmount = content.initialAmount;
  contributionContent.initialPeriod = content.initialPeriod;
  contributionContent.minMonthlyAmount = content.minMonthlyAmount;
  contributionContent.periods = content.periods;
  contributionContent.showAbsorbFee = content.showAbsorbFee;
  contributionContent.paymentMethods = content.paymentMethods;

  resetNewContribution();

  isIniting.value = false;
};

const submitCreateContribution = () => {
  return startContribution(newContribution).then((data) => {
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else if (data.clientSecret) {
      // TODO
    }
  });
};

const submitUpdateContribution = () => {
  return updateContribution(newContribution)
    .then((data) => {
      currentContribution.amount = data.amount;
      currentContribution.period = data.period;
      currentContribution.nextAmount = data.nextAmount;
      resetNewContribution();

      hasUpdatedContribution.value = true;
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

const canSubmitContribution = computed(
  () =>
    !isActiveMemberWithGoCardless.value ||
    currentContribution.amount != newContribution.amount
);

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
    .then((data) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        // TODO: handle clientSecret route
      }
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

const showChangePeriod = computed(
  () =>
    !isActiveMemberWithGoCardless.value &&
    currentContribution.period !== ContributionPeriod.Annually
);

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
    canSubmitContribution,
    submitContributionLoading,
    submitContribution,
    cantUpdateContribution,
    hasUpdatedContribution,
    hasManualType,
    contributionButtonText,
    updatePaymentSourceLoading,
    updatePaymentSource,
    cantUpdatePaymentSource,
    isActiveMemberWithGoCardless,
    showChangePeriod,
    showProrateOptions,
    submitCancelContribution,
    cancelContributionLoading,
  };
}
