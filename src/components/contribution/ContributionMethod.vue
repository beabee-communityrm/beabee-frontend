<template>
  <div>
    <h3 class="font-semibold text-lg mb-1">{{ t('join.paymentMethod') }}</h3>
    <div class="flex flex-wrap gap-2">
      <div v-for="method in methods" :key="method" class="flex-1">
        <button
          class="
            h-12
            w-full
            rounded
            border border-primary-40
            font-semibold
            cursor-pointer
          "
          :class="
            method === modelValue ? 'bg-link text-white' : 'hover:bg-link-10'
          "
          type="button"
          @click="emit('update:modelValue', method)"
        >
          {{ availableMethods[method].label }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';

interface MethodOpts {
  label: string;
  image: string;
}

const availableMethods: Record<PaymentMethod, MethodOpts> = {
  [PaymentMethod.StripeCard]: {
    label: 'Card',
    image: '',
  },
  [PaymentMethod.StripeSEPA]: {
    label: 'SEPA debit',
    image: '',
  },
  [PaymentMethod.GoCardlessDirectDebit]: {
    label: 'Direct debit',
    image: '',
  },
} as const;

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: PaymentMethod;
  methods: PaymentMethod[];
}>();
</script>
