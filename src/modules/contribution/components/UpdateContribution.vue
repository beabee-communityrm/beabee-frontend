<template>
  <form @submit.prevent="handleSubmit">
    <SectionTitle class="mb-2">{{ t('contribution.billing') }} </SectionTitle>

    <p v-if="hasManualType" class="mb-4">
      {{ t('contribution.manualPayment') }}
    </p>

    <Contribution
      v-model:amount="newContribution.amount"
      v-model:payFee="newContribution.payFee"
      v-model:period="newContribution.period"
      v-model:paymentMethod="newContribution.paymentMethod"
      :content="content"
      :show-period="showChangePeriod"
      :show-payment-method="!isAutoActiveMember"
    />

    <ProrateContribution
      v-if="showProrateOptions"
      v-model="newContribution.prorate"
      :new-amount="newContribution.amount"
      :old-amount="props.contribution.amount!"
      :renewal-date="props.contribution.renewalDate!"
    />

    <MessageBox v-if="hasUpdatedContribution" class="mb-4" type="success">
      {{ t('contribution.updatedContribution') }}
    </MessageBox>

    <MessageBox v-if="cantUpdateContribution" class="mb-4" type="error">
      {{ t('contribution.contributionUpdateError') }}
    </MessageBox>

    <AppButton
      :disabled="!canSubmit || validation.$invalid"
      type="submit"
      variant="link"
      class="mb-4 w-full"
      :loading="loading"
    >
      {{ contributionButtonText }}
    </AppButton>

    <InfoMessage
      v-if="!isAutoActiveMember"
      :message="t('contribution.changeBankInfo')"
    />
  </form>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import InfoMessage from '../../../components/InfoMessage.vue';
import SectionTitle from '../../../components/SectionTitle.vue';
import Contribution from '../../../components/contribution/Contribution.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import ProrateContribution from './ProrateContribution.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { ContributionContent } from '../../../components/contribution/contribution.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { fetchJoinContent } from '../../../utils/api/content';
import { ContributionInfo } from '../../../utils/api/api.interface';
import { PaymentMethod } from '../../../utils/enums/payment-method.enum';
import { ContributionType } from '../../../utils/enums/contribution-type.enum';
import { MembershipStatus } from '../../../utils/enums/membership-status.enum';
import {
  startContribution,
  updateContribution,
} from '../../../utils/api/member';
import axios from 'axios';

const validation = useVuelidate();

const { t } = useI18n();

const props = defineProps<{
  contribution: ContributionInfo;
}>();

const content = ref<ContributionContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  paymentMethods: [],
});

const newContribution = reactive({
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  prorate: true,
  paymentMethod: PaymentMethod.StripeCard,
});

const cantUpdateContribution = ref(false);
const hasUpdatedContribution = ref(false);
const loading = ref(false);

const hasManualType = computed(
  () => props.contribution.type === ContributionType.Manual
);
const isActiveMember = computed(
  () => props.contribution.membershipStatus === MembershipStatus.Active
);
const isAutoActiveMember = computed(
  () =>
    isActiveMember.value &&
    props.contribution.type === ContributionType.Automatic
);
const isExpiringMember = computed(
  () => props.contribution.membershipStatus === MembershipStatus.Expiring
);

const contributionButtonText = computed(() => {
  if (hasManualType.value) return t('contribution.updatePaymentType');
  else if (isActiveMember.value) return t('contribution.updateContribution');
  else if (isExpiringMember.value) return t('contribution.restartContribution');
  return t('contribution.startContribution');
});

const showChangePeriod = computed(
  () =>
    !isAutoActiveMember.value &&
    props.contribution.period !== ContributionPeriod.Annually
);

const showProrateOptions = computed(() => {
  return (
    props.contribution.period === ContributionPeriod.Annually &&
    props.contribution.amount !== newContribution.amount
  );
});

const canSubmit = computed(
  () =>
    !isAutoActiveMember.value ||
    props.contribution.amount != newContribution.amount
);

async function handleCreate() {
  const data = await startContribution(newContribution);
  if (data.redirectUrl) {
    window.location.href = data.redirectUrl;
  } else if (data.clientSecret) {
  }
}

async function handleUpdate() {
  try {
    const data = await updateContribution(newContribution);
    // TODO:
    // currentContribution.amount = data.amount;
    // currentContribution.period = data.period;
    // currentContribution.nextAmount = data.nextAmount;
    resetNewContribution();

    hasUpdatedContribution.value = true;
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 400 &&
      err.response.data.code === 'cant-update-contribution'
    ) {
      cantUpdateContribution.value = true;
    }
  }
}

async function handleSubmit() {
  loading.value = true;

  try {
    await (isAutoActiveMember.value ? handleUpdate() : handleCreate());
  } finally {
    loading.value = false;
  }
}

function resetNewContribution() {
  newContribution.amount =
    props.contribution.amount || content.value.initialAmount;
  newContribution.period =
    props.contribution.period || content.value.initialPeriod;
  newContribution.payFee = content.value.showAbsorbFee
    ? !!props.contribution.payFee
    : false;
  newContribution.prorate = true;
}

onBeforeMount(async () => {
  content.value = await fetchJoinContent();
  newContribution.paymentMethod = content.value.paymentMethods[0];
  resetNewContribution();
});
</script>
