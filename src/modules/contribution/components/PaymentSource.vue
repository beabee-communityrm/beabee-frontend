<template>
  <div>
    <SectionTitle class="mb-4">{{
      t('contribution.paymentMethod')
    }}</SectionTitle>

    <div class="mb-4">
      <PaymentMethodIcon :method="paymentSource.method" />
      {{ paymentSourceDescription }}
    </div>

    <MessageBox v-if="cantUpdate" class="mb-4" type="error">
      {{ t('contribution.paymentSourceUpdateError') }}
    </MessageBox>

    <AppButton
      :loading="loading"
      variant="primaryOutlined"
      class="mb-2 w-full"
      @click="handleUpdate"
    >
      {{ changeLabel }}
    </AppButton>

    <AppModal
      v-if="stripeClientSecret"
      :class="{ hidden: !stripePaymentLoaded }"
      @close="reset"
    >
      <SectionTitle class="mb-4">{{ changeLabel }}</SectionTitle>
      <StripePayment
        :client-secret="stripeClientSecret"
        :email="email"
        :return-url="updatePaymentMethodCompleteUrl"
        @loaded="onStripeLoaded"
      />
    </AppModal>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onBeforeMount, ref } from 'vue';
import MessageBox from '../../../components/MessageBox.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';
import { PaymentSource } from '../../../utils/api/api.interface';
import {
  updatePaymentMethod,
  updatePaymentMethodCompleteUrl,
} from '../../../utils/api/member';
import StripePayment from '../../../components/StripePayment.vue';
import AppModal from '../../../components/AppModal.vue';
import SectionTitle from '../../../components/SectionTitle.vue';
import { PaymentMethod } from '../../../utils/enums/payment-method.enum';
import PaymentMethodIcon from '../../../components/payment-method/PaymentMethodIcon.vue';
import { computed } from '@vue/reactivity';

const { t } = useI18n();

const props = defineProps<{
  paymentSource: PaymentSource;
  email: string;
}>();

const loading = ref(false);
const cantUpdate = ref(false);
const stripeClientSecret = ref('');
const stripePaymentLoaded = ref(false);

const paymentSourceDescription = computed(() => {
  const source = props.paymentSource;
  switch (source.method) {
    case PaymentMethod.StripeCard:
      return `•••• •••• •••• ${source.last4}, ${String(
        source.expiryMonth
      ).padStart(2, '0')}/${source.expiryYear}`;
    case PaymentMethod.StripeBACS:
      return `${source.sortCode} ••••••••••${source.last4}`;
    case PaymentMethod.StripeSEPA:
      return `${source.country}••${source.bankCode}${source.branchCode}••••${source.last4}`;
    case PaymentMethod.GoCardlessDirectDebit:
      return `${source.accountHolderName}, ${source.bankName}, ••••••••••${source.accountNumberEnding}`;
  }
});

const changeLabel = computed(() =>
  t(`paymentMethods.${props.paymentSource.method}.changeLabel`)
);

function reset() {
  loading.value = false;
  stripeClientSecret.value = '';
  stripePaymentLoaded.value = false;
}

function onStripeLoaded() {
  stripePaymentLoaded.value = true;
  loading.value = false;
}

async function handleUpdate() {
  loading.value = true;
  try {
    const data = await updatePaymentMethod();
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else if (data.clientSecret) {
      stripeClientSecret.value = data.clientSecret;
    }
  } catch (err: unknown) {
    loading.value = false;
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 400 &&
      err.response.data.code === 'cant-update-contribution'
    ) {
      cantUpdate.value = true;
    }
  }
}

onBeforeMount(reset);
</script>
