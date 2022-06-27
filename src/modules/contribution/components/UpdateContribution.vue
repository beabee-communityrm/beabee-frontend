<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <AppHeading class="mb-2">{{ t('contribution.billing') }} </AppHeading>

      <p v-if="isManualActiveMember" class="mb-4">
        {{ t('contribution.manualPayment') }}
      </p>

      <AppAlert
        v-if="modelValue.nextAmount && modelValue.renewalDate"
        variant="info"
        class="mb-4"
      >
        <template #icon
          ><font-awesome-icon :icon="['fa', 'info-circle']"
        /></template>
        {{
          t('contribution.nextAmountChanging', {
            nextAmount: n(modelValue.nextAmount, 'currency'),
            renewalDate: formatLocale(modelValue.renewalDate, 'PPP'),
          })
        }}
      </AppAlert>

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
    <AppModal
      v-if="stripeClientSecret"
      :open="stripePaymentLoaded"
      class="w-full"
      @close="reset"
    >
      <AppHeading class="mb-4">{{
        t(`paymentMethods.${newContribution.paymentMethod}.setLabel`)
      }}</AppHeading>
      <StripePayment
        :client-secret="stripeClientSecret"
        :email="email"
        :return-url="startContributionCompleteUrl"
        @loaded="onStripeLoaded"
      />
    </AppModal>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import Contribution from '../../../components/contribution/Contribution.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import ProrateContribution from './ProrateContribution.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { ContributionContent } from '../../../components/contribution/contribution.interface';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { fetchContent } from '../../../utils/api/content';
import { ContributionInfo } from '../../../utils/api/api.interface';
import { PaymentMethod } from '../../../utils/enums/payment-method.enum';
import { ContributionType } from '../../../utils/enums/contribution-type.enum';
import { MembershipStatus } from '../../../utils/enums/membership-status.enum';
import {
  startContribution,
  startContributionCompleteUrl,
  updateContribution,
} from '../../../utils/api/member';
import AppModal from '../../../components/AppModal.vue';
import StripePayment from '../../../components/StripePayment.vue';
import { currentUser } from '../../../store/currentUser';
import AppAlert from '../../../components/AppAlert.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import AppHeading from '../../../components/AppHeading.vue';

const validation = useVuelidate();

const { t, n } = useI18n();

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
  paymentMethods: [PaymentMethod.StripeCard],
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
const stripeClientSecret = ref('');
const stripePaymentLoaded = ref(false);

const email = computed(() =>
  currentUser.value ? currentUser.value.email : ''
);

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
const showChangePeriod = computed(
  () =>
    !isActiveMember.value ||
    (isManualActiveMember.value &&
      props.modelValue.period !== ContributionPeriod.Annually)
);

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

function onStripeLoaded() {
  stripePaymentLoaded.value = true;
  loading.value = false;
}

function reset() {
  cantUpdate.value = false;
  hasUpdated.value = false;
  loading.value = false;
  stripeClientSecret.value = '';
  stripePaymentLoaded.value = false;
}

watch(
  [props, content],
  () => {
    newContribution.amount =
      props.modelValue.amount || content.value.initialAmount;
    newContribution.period =
      props.modelValue.period || content.value.initialPeriod;
    newContribution.payFee = content.value.showAbsorbFee
      ? props.modelValue.payFee === undefined
        ? true
        : props.modelValue.payFee
      : false;
    newContribution.prorate = true;
    newContribution.paymentMethod =
      props.modelValue.paymentSource?.method || content.value.paymentMethods[0];
  },
  { immediate: true }
);

onBeforeMount(async () => {
  reset();
  content.value = await fetchContent('join');
});
</script>
