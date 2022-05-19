<template>
  <template v-if="show">
    <AppAlert variant="info" class="mb-4">
      <template #icon>
        <font-awesome-icon :icon="['fa', 'hand-sparkles']" />
      </template>
      You'll be contributing {{ n(paymentData.amount, 'currency') }}/{{
        paymentData.period
      }}
    </AppAlert>
    <p class="mb-3">
      You'll be able to modify your contribution and access your payment history
      at any time in your member account
    </p>
    <p class="mb-6">
      Did you miss something?
      <a class="cursor-pointer underline text-link" @click="emit('back')">
        Back to the previous screen
      </a>
    </p>
  </template>
  <div ref="divRef"></div>
  <MessageBox v-if="error" type="error">{{ error }}</MessageBox>
  <AppButton
    v-if="show"
    :disabled="!paymentReady"
    :loading="loading"
    variant="link"
    type="submit"
    class="w-full mt-4"
    @click="completePayment"
    >Complete</AppButton
  >
</template>
<script lang="ts" setup>
import { loadStripe } from '@stripe/stripe-js/pure';
import { onBeforeMount, ref } from 'vue';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import AppButton from '../../../../components/forms/AppButton.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import AppAlert from '../../../../components/AppAlert.vue';
import { useI18n } from 'vue-i18n';

const { n } = useI18n();

const emit = defineEmits(['loaded', 'back']);

const props = defineProps<{
  show: boolean;
  clientSecret: string;
  paymentData: {
    email: string;
    amount: number;
    period: ContributionPeriod;
    payFee: boolean;
  };
}>();

const divRef = ref<HTMLElement>();
const paymentReady = ref(false);
const loading = ref(false);
const error = ref('');

// eslint-disable-next-line @typescript-eslint/no-empty-function
let completePayment = ref(() => {});

onBeforeMount(async () => {
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  if (stripe && divRef.value) {
    const elements = stripe.elements({
      clientSecret: props.clientSecret,
    });
    const paymentElement = elements.create('payment', {
      fields: {
        billingDetails: {
          email: 'never',
        },
      },
    });
    paymentElement.mount(divRef.value);
    paymentElement.on('ready', () => emit('loaded'));
    paymentElement.on('change', (evt) => {
      paymentReady.value = evt.complete;
    });

    completePayment.value = async () => {
      loading.value = true;
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: import.meta.env.VITE_APP_BASE_URL + '/join/complete',
          payment_method_data: {
            billing_details: {
              email: props.paymentData.email,
            },
          },
        },
      });
      if (result.error) {
        loading.value = false;
        error.value =
          result.error.message &&
          (result.error.type === 'card_error' ||
            result.error.type === 'validation_error')
            ? (error.value = result.error.message)
            : 'There was a problem';
      }
    };
  }
});
</script>
