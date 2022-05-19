<template>
  <div>
    <div class="mb-4">
      <font-awesome-icon
        class="text-2xl -mb-1 mr-3"
        :icon="['far', 'credit-card']"
      />

      <span v-if="paymentSource.type === PaymentMethod.DirectDebit">
        {{ paymentSource.accountHolderName }}, {{ paymentSource.bankName }},
        ••••••••••{{ paymentSource.accountNumberEnding }}
      </span>
      <span v-else>
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
        paymentSource.type === PaymentMethod.DirectDebit
          ? t('contribution.changeBank')
          : t('contribution.changeCard')
      }}
    </AppButton>

    <StripePayment
      v-if="stripeClientSecret"
      :client-secret="stripeClientSecret"
      email="TODO"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MessageBox from '../../../components/MessageBox.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';
import { PaymentSource } from '../../../utils/api/api.interface';
import { PaymentMethod } from '../../../utils/enums/payment-method.enum';
import { updatePaymentSource } from '../../../utils/api/member';
import axios from 'axios';
import StripePayment from '../../../components/StripePayment.vue';

PaymentMethod;

const { t } = useI18n();

defineProps<{
  paymentSource: PaymentSource;
}>();

const loading = ref(false);
const cantUpdate = ref(false);
const stripeClientSecret = ref('');

async function handleUpdate() {
  loading.value = true;
  try {
    const data = await updatePaymentSource();
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
</script>
