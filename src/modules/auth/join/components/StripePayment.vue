<template>
  <p v-if="show">Join for {{ paymentData.amount }}/{{ paymentData.period }}</p>
  <div class="my-4" ref="divRef"></div>
  <MessageBox v-if="error" type="error">{{ error }}</MessageBox>
  <AppButton
    v-if="show"
    :disabled="!paymentReady"
    :loading="loading"
    variant="link"
    type="submit"
    class="w-full"
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
const emit = defineEmits(['ready']);

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
    paymentElement.on('ready', () => emit('ready'));
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
