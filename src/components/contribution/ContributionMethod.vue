<template>
  <div v-if="methods.length > 1">
    <AppSubHeading class="mb-2">{{ t('join.paymentMethod') }}</AppSubHeading>
    <div
      class="mb-6 grid gap-2"
      :class="methods.length > 2 ? 'grid-cols-3' : 'grid-cols-2'"
    >
      <div v-for="method in methods" :key="method">
        <PaymentMethodButton
          :method="method"
          :selected="modelValue === method"
          :small="methods.length === 2"
          @click="emit('update:modelValue', $event)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PaymentMethod } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import AppSubHeading from '../AppSubHeading.vue';
import PaymentMethodButton from '../payment/PaymentMethodButton.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: PaymentMethod;
  methods: PaymentMethod[];
}>();
</script>
