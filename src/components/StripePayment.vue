<template>
  <template v-if="showNameFields">
    <div class="mb-3">
      <AppLabel :label="t('form.firstName')" class="font-normal" />
      <AppInput
        v-model="firstName"
        :error-message="validation.firstName.$errors[0]?.$message"
        @blur="validation.firstName.$touch"
      />
    </div>

    <div class="mb-3">
      <AppLabel :label="t('form.lastName')" class="font-normal" />
      <AppInput
        v-model="lastName"
        :error-message="validation.lastName.$errors[0]?.$message"
        @blur="validation.lastName.$touch"
      />
    </div>
  </template>

  <div ref="divRef"></div>

  <MessageBox v-if="error" type="error" class="mt-4">{{ error }}</MessageBox>

  <AppButton
    :disabled="!paymentReady || validation.$invalid"
    :loading="loading"
    variant="link"
    type="submit"
    class="w-full mt-4"
    @click="completePayment"
    >{{ t('actions.continue') }}</AppButton
  >
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { Appearance } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from './forms/AppButton.vue';
import MessageBox from './MessageBox.vue';
import AppInput from './forms/AppInput.vue';
import AppLabel from './forms/AppLabel.vue';

import theme from 'virtual:theme';
import { helpers, requiredIf } from '@vuelidate/validators';

const emit = defineEmits(['loaded']);

const props = defineProps<{
  clientSecret: string;
  email: string;
  returnUrl: string;
  showNameFields?: boolean;
}>();

const { t } = useI18n();

const divRef = ref<HTMLElement>();
const paymentReady = ref(false);
const loading = ref(false);
const error = ref('');

const firstName = ref('');
const lastName = ref('');

const validation = useVuelidate(
  {
    firstName: {
      required: helpers.withMessage(
        t('form.errors.firstName.required'),
        requiredIf(!!props.showNameFields)
      ),
    },
    lastName: {
      required: helpers.withMessage(
        t('form.errors.lastName.required'),
        requiredIf(!!props.showNameFields)
      ),
    },
  },
  { firstName, lastName }
);

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
    fontSizeBase: theme.fontSize.base[0],
    fontSizeSm: theme.fontSize.sm[0],
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
    '.Label': {
      fontSize: theme.fontSize.base[0],
      marginBottom: theme.spacing['1.5'],
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
          ...(props.showNameFields && {
            name: 'never',
          }),
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
      const returnUrl =
        props.returnUrl +
        (props.showNameFields
          ? `?firstName=${encodeURIComponent(
              firstName.value
            )}&lastName=${encodeURIComponent(lastName.value)}`
          : '');
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: returnUrl,
          payment_method_data: {
            billing_details: {
              email: props.email,
              ...(props.showNameFields && {
                name: `${firstName.value} ${lastName.value}`,
              }),
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
            : t('joinPayment.genericError');
      }
    };
  }
});
</script>
<style scoped>
.StripeElement {
  overflow: hidden;
}
</style>
