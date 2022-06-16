<template>
  <div>
    <SectionTitle class="mb-4">{{
      t('contribution.bankAccount')
    }}</SectionTitle>

    <div class="mb-4">
      <PaymentMethodIcon :method="paymentSource.method" />

      <span v-if="paymentSource.method === PaymentMethod.GoCardlessDirectDebit">
        {{ paymentSource.accountHolderName }}, {{ paymentSource.bankName }},
        ••••••••••{{ paymentSource.accountNumberEnding }}
      </span>
      <span v-else-if="paymentSource.method === PaymentMethod.StripeCard">
        •••• •••• •••• {{ paymentSource.last4 }},
        {{ paymentSource.expiryMonth }}/{{ paymentSource.expiryYear }}
      </span>
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
      {{
        paymentSource.method === PaymentMethod.GoCardlessDirectDebit
          ? t('contribution.changeBank')
          : t('contribution.changeCard')
      }}
    </AppButton>

    <AppModal
      v-if="stripeClientSecret"
      :class="{ hidden: !stripePaymentLoaded }"
      @close="reset"
    >
      <SectionTitle class="mb-4">Update your card</SectionTitle>
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
import PaymentMethodIcon from '../../../components/contribution/icons/PaymentMethodIcon.vue';

const { t } = useI18n();

PaymentMethod;

defineProps<{
  paymentSource: PaymentSource;
  email: string;
}>();

const loading = ref(false);
const cantUpdate = ref(false);
const stripeClientSecret = ref('');
const stripePaymentLoaded = ref(false);

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
