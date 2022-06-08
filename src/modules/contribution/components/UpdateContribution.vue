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
      :old-amount="modelValue.amount!"
      :renewal-date="modelValue.renewalDate!"
    />

    <MessageBox v-if="hasUpdated" class="mb-4" type="success">
      {{ t('contribution.updatedContribution') }}
    </MessageBox>

    <MessageBox v-if="cantUpdate" class="mb-4" type="error">
      {{ t('contribution.contributionUpdateError') }}
    </MessageBox>

    <AppButton
      :disabled="!canSubmit || validation.$invalid"
      type="submit"
      variant="link"
      class="mb-4 w-full"
      :loading="loading"
    >
      {{
        hasManualType
          ? t('contribution.updatePaymentType')
          : isActiveMember
          ? t('contribution.updateContribution')
          : isExpiringMember
          ? t('contribution.restartContribution')
          : t('contribution.startContribution')
      }}
    </AppButton>

    <InfoMessage
      v-if="!isAutoActiveMember"
      :message="t('contribution.changeBankInfo')"
    />
  </form>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
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

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: ContributionInfo;
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

const cantUpdate = ref(false);
const hasUpdated = ref(false);
const loading = ref(false);

const hasManualType = computed(
  () => props.modelValue.type === ContributionType.Manual
);
const isActiveMember = computed(
  () => props.modelValue.membershipStatus === MembershipStatus.Active
);
const isAutoActiveMember = computed(
  () =>
    isActiveMember.value && props.modelValue.type === ContributionType.Automatic
);
const isExpiringMember = computed(
  () => props.modelValue.membershipStatus === MembershipStatus.Expiring
);

const showChangePeriod = computed(
  () =>
    !isAutoActiveMember.value &&
    props.modelValue.period !== ContributionPeriod.Annually
);

const showProrateOptions = computed(() => {
  return (
    props.modelValue.period === ContributionPeriod.Annually &&
    props.modelValue.amount !== newContribution.amount
  );
});

const canSubmit = computed(
  () =>
    !isAutoActiveMember.value ||
    props.modelValue.amount != newContribution.amount
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
    emit('update:modelValue', data);

    hasUpdated.value = true;
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 400 &&
      err.response.data.code === 'cant-update-contribution'
    ) {
      cantUpdate.value = true;
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

watch(
  props,
  () => {
    newContribution.amount =
      props.modelValue.amount || content.value.initialAmount;
    newContribution.period =
      props.modelValue.period || content.value.initialPeriod;
    newContribution.payFee = content.value.showAbsorbFee
      ? !!props.modelValue.payFee
      : false;
    newContribution.prorate = true;
  },
  { immediate: true }
);

onBeforeMount(async () => {
  content.value = await fetchJoinContent();
  newContribution.paymentMethod = content.value.paymentMethods[0];
});
</script>
