<template>
  <div v-if="methods.length > 1">
    <AppSubHeading class="mb-1">{{ t('join.paymentMethod') }}</AppSubHeading>
    <div
      class="grid grid-cols-3 gap-2"
      :class="methods.length > 2 ? 'grid-cols-3' : 'grid-cols-2'"
    >
      <div v-for="method in methods" :key="method">
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
          <PaymentMethodIcon :method="method" /><span
            :class="methods.length > 2 ? 'block' : 'inline m-2'"
            >{{ t(`paymentMethods.${method}.label`) }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { PaymentMethod } from '../../utils/enums/payment-method.enum';
import PaymentMethodIcon from '../payment-method/PaymentMethodIcon.vue';
import AppSubHeading from '../AppSubHeading.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: PaymentMethod;
  methods: PaymentMethod[];
}>();
</script>
