<template>
  <form @submit.prevent="handleSubmit">
    <AppHeading class="mt-6 mb-2">
      {{ t('contribution.billing') }}
    </AppHeading>

    <AppInput label="Amount" type="number" class="mb-3" />

    <AppRadioGroup
      v-model="currentPeriod"
      name="period"
      label="Period"
      :options="[
        [false, 'Monthly'],
        [true, 'Yearly'],
      ]"
      class="mb-4"
    />

    <AppSelect label="Source" :items="periodOptions" class="mb-3" />

    <AppInput label="Reference" class="mb-3" />

    <AppButton
      :disabled="!canSubmit || validation.$invalid"
      type="submit"
      variant="link"
      class="mt-6"
      :loading="loading"
    >
      {{
        isManualActiveMember
          ? t('contribution.updatePaymentType')
          : isActiveMember
          ? t('contribution.updateContribution')
          : isExpiringMember
          ? t('contribution.restartContribution')
          : t('contribution.startContribution')
      }}
    </AppButton>
  </form>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import AppButton from '../../../forms/AppButton.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { ContributionContent } from '../../../contribution/contribution.interface';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import { ContributionInfo } from '../../../../utils/api/api.interface';
import { PaymentMethod } from '../../../../utils/enums/payment-method.enum';
import { ContributionType } from '../../../../utils/enums/contribution-type.enum';
import { MembershipStatus } from '../../../../utils/enums/membership-status.enum';
import {
  startContribution,
  updateContribution,
} from '../../../../utils/api/member';
// import { currentUser } from '../../../../store/currentUser';
import AppHeading from '../../../AppHeading.vue';
import { isRequestError } from '../../../../utils/api';

const validation = useVuelidate();

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: ContributionInfo;
  content: ContributionContent;
}>();

const newContribution = reactive({
  amount: 5,
  period: ContributionPeriod.Monthly,
  payFee: true,
  prorate: true,
  paymentMethod: PaymentMethod.StripeCard,
});

const periodOptions = [
  {
    id: 'auto',
    label: 'Automatic',
  },
  {
    id: 'manual',
    label: 'Manual',
  },
];

const cantUpdate = ref(false);
const hasUpdated = ref(false);
const loading = ref(false);
const stripeClientSecret = ref('');
const stripePaymentLoaded = ref(false);

const isActiveMember = computed(
  () => props.modelValue.membershipStatus === MembershipStatus.Active
);
const isExpiringMember = computed(
  () => props.modelValue.membershipStatus === MembershipStatus.Expiring
);

const isManualActiveMember = computed(
  () =>
    isActiveMember.value && props.modelValue.type === ContributionType.Manual
);
const isAutoActiveMember = computed(
  () =>
    isActiveMember.value && props.modelValue.type === ContributionType.Automatic
);

// Only non-active members and monthly manual contributors can change their period
// as otherwise proration gets complicated
/*
const showChangePeriod = computed(
  () =>
    !isActiveMember.value ||
    (isManualActiveMember.value &&
      props.modelValue.period !== ContributionPeriod.Annually)
);
*/

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
    stripeClientSecret.value = data.clientSecret;
  }
}

async function handleUpdate() {
  try {
    const data = await updateContribution(newContribution);
    emit('update:modelValue', data);

    hasUpdated.value = true;
  } catch (err) {
    if (isRequestError(err, 'cant-update-contribution')) {
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

function reset() {
  cantUpdate.value = false;
  hasUpdated.value = false;
  loading.value = false;
  stripeClientSecret.value = '';
  stripePaymentLoaded.value = false;
}

watch(
  props,
  () => {
    newContribution.amount =
      props.modelValue.amount || props.content.initialAmount;
    newContribution.period =
      props.modelValue.period || props.content.initialPeriod;
    newContribution.payFee = props.content.showAbsorbFee
      ? props.modelValue.payFee === undefined
        ? true
        : props.modelValue.payFee
      : false;
    newContribution.prorate = true;
    newContribution.paymentMethod =
      props.modelValue.paymentSource?.method || props.content.paymentMethods[0];
  },
  { immediate: true }
);

onBeforeMount(reset);
</script>
