<template>
  <div ref="divRef"></div>
</template>
<script lang="ts" setup>
import { loadStripe } from '@stripe/stripe-js/pure';
import { onBeforeMount, ref } from 'vue';
const props = defineProps<{
  clientSecret: string;
}>();

const divRef = ref<HTMLElement>();

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
  }
});
</script>
