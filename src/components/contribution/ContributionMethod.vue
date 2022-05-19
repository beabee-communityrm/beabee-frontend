<template>
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
</template>
<script lang="ts" setup>
import { PaymentMethod } from '../../utils/enums/payment-method.enum';

interface MethodOpts {
  label: string;
  image: string;
}

const availableMethods: Record<PaymentMethod, MethodOpts> = {
  card: {
    label: 'Card',
    image: '',
  },
  'direct-debit': {
    label: 'Direct debit',
    image: '',
  },
} as const;

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: PaymentMethod;
  methods: PaymentMethod[];
}>();
</script>
