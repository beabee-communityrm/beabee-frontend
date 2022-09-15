<template>
  <section class="mb-8">
    <p class="leading-normal mb-2 text-sm">
      {{ t('join.absorbFeeText', { fee: n(fee, 'currency') }) }}
    </p>

    <AppCheckbox
      v-model="payFee"
      :disabled="force"
      :label="
        t(force ? 'join.absorbFeeForce' : 'join.absorbFeeOptIn', {
          fee: n(fee, 'currency'),
          amount: n(amount, 'currency'),
        })
      "
    />
  </section>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';
import AppCheckbox from '../forms/AppCheckbox.vue';

const { t, n } = useI18n();

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  amount: {
    type: Number,
    default: 0,
  },
  fee: {
    type: Number,
    default: 0,
  },
  force: {
    type: Boolean,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const payFee = computed<boolean>({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
</script>
