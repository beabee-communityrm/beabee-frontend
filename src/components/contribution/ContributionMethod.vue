<template>
  <div v-if="methods.length > 1">
    <AppSubHeading class="mb-2">{{ t('join.paymentMethod') }}</AppSubHeading>
    <div
      class="mb-6 grid grid-cols-3 gap-2"
      :class="methods.length > 2 ? 'grid-cols-3' : 'grid-cols-2'"
    >
      <div v-for="method in methods" :key="method">
        <button
          class="h-full min-h-[2.5rem] w-full cursor-pointer rounded border border-primary-40 bg-white p-1.5 text-left text-lg font-semibold"
          :class="
            method === modelValue
              ? '!border-link-110 bg-link text-white'
              : 'hover:border-link hover:bg-link-10'
          "
          type="button"
          @click="emit('update:modelValue', method)"
        >
          <PaymentMethodIcon :method="method" /><span
            class="text-xs"
            :class="methods.length > 2 ? 'block' : 'm-2 inline'"
            >{{ t(`paymentMethods.${method}.label`) }}</span
          >
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { PaymentMethod } from '@beabee/beabee-common';
import PaymentMethodIcon from '../payment-method/PaymentMethodIcon.vue';
import AppSubHeading from '../AppSubHeading.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: PaymentMethod;
  methods: PaymentMethod[];
}>();
</script>
