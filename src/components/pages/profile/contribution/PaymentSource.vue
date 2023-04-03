<template>
  <div>
    <AppHeading class="mb-4">{{ t('contribution.paymentMethod') }}</AppHeading>

    <PaymentMethod class="mb-4" :source="paymentSource" />

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
      :open="stripePaymentLoaded"
      :title="changeLabel"
      class="w-full"
      @close="reset"
    >
      <StripePayment
        :client-secret="stripeClientSecret"
        :public-key="stripePublicKey"
        :email="email"
        :return-url="updatePaymentMethodCompleteUrl"
        @loaded="onStripeLoaded"
      />
    </AppModal>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import MessageBox from '../../../MessageBox.vue';
import AppButton from '../../../button/AppButton.vue';
import { useI18n } from 'vue-i18n';
import {
  ManualPaymentSource,
  PaymentSource,
} from '../../../../utils/api/api.interface';
import {
  updatePaymentMethod,
  updatePaymentMethodCompleteUrl,
} from '../../../../utils/api/contact';
import StripePayment from '../../../StripePayment.vue';
import AppModal from '../../../AppModal.vue';
import { computed } from 'vue';
import AppHeading from '../../../AppHeading.vue';
import { isRequestError } from '../../../../utils/api';
import PaymentMethod from '../../../payment-method/PaymentMethod.vue';

const { t } = useI18n();

const props = defineProps<{
  stripePublicKey: string;
  paymentSource: Exclude<PaymentSource, ManualPaymentSource>;
  email: string;
}>();

const loading = ref(false);
const cantUpdate = ref(false);
const stripeClientSecret = ref('');
const stripePaymentLoaded = ref(false);

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
    if (isRequestError(err, 'cant-update-contribution')) {
      cantUpdate.value = true;
    }
  }
}

onBeforeMount(reset);
</script>
