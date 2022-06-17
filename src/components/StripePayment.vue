<template>
  <div ref="divRef"></div>
  <MessageBox v-if="error" type="error">{{ error }}</MessageBox>
  <AppButton
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
import { Appearance } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from './forms/AppButton.vue';
import MessageBox from './MessageBox.vue';

import theme from 'virtual:theme';

const emit = defineEmits(['loaded']);

const props = defineProps<{
  clientSecret: string;
  email: string;
  returnUrl: string;
}>();

const { t } = useI18n();

const divRef = ref<HTMLElement>();
const paymentReady = ref(false);
const loading = ref(false);
const error = ref('');

// eslint-disable-next-line @typescript-eslint/no-empty-function
let completePayment = ref(() => {});

const appearance: Appearance = {
  theme: 'flat',
  variables: {
    colorDanger: theme.colors.danger.DEFAULT,
    colorPrimary: theme.colors.link.DEFAULT,
    colorText: theme.colors.body.DEFAULT,
    colorBackground: theme.colors.white.DEFAULT,
    borderRadius: theme.borderRadius.DEFAULT,
    fontLineHeight: theme.lineHeight.tight,
    //fontFamily: theme.fontFamily.body,
  },
  rules: {
    '.Input': {
      border: '1px solid ' + theme.colors.primary['40'],
      padding: theme.spacing['2'],
      lineHeight: theme.lineHeight.tight,
    },
    '.Input:focus': {
      boxShadow: theme.boxShadow.input,
    },
    '.Input--invalid': {
      backgroundColor: theme.colors.danger['10'],
      borderColor: theme.colors.danger['70'],
      color: 'inherit',
      boxShadow: 'none',
    },
  },
};

onBeforeMount(async () => {
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  if (stripe && divRef.value) {
    const elements = stripe.elements({
      clientSecret: props.clientSecret,
      appearance,
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
    paymentElement.on('change', (evt: { complete: boolean }) => {
      paymentReady.value = evt.complete;
    });

    completePayment.value = async () => {
      loading.value = true;
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: props.returnUrl,
          payment_method_data: {
            billing_details: {
              email: props.email,
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
            : t('notification.error');
      }
    };
  }
});
</script>
