<template>
  <div>
    <h3 class="font-semibold text-lg mb-1">{{ t('join.paymentMethod') }}</h3>
    <div class="flex flex-wrap gap-2">
      <div v-for="method in methods" :key="method" class="flex-1">
        <button
          class="
            w-full
            h-full
            min-h-[2.5rem]
            rounded
            border border-primary-40
            font-semibold
            cursor-pointer
            text-left text-sm
            p-2
          "
          :class="
            method === modelValue ? 'bg-link text-white' : 'hover:bg-link-10'
          "
          type="button"
          @click="emit('update:modelValue', method)"
        >
          <component :is="icons[method]" class="mr-2" /><span
            :class="methods.length > 2 ? 'block' : 'inline'"
            >{{ t('paymentMethods.' + method) }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';

import Card from './icons/Card.vue';
import DirectDebit from './icons/DirectDebit.vue';
import SEPA from './icons/SEPA.vue';

const icons = {
  [PaymentMethod.StripeCard]: Card,
  [PaymentMethod.StripeSEPA]: SEPA,
  [PaymentMethod.GoCardlessDirectDebit]: DirectDebit,
};

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: PaymentMethod;
  methods: PaymentMethod[];
}>();
</script>
