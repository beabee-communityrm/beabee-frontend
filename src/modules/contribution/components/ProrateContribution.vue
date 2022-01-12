<template>
  <label class="flex mb-2">
    <div class="flex-none mr-1">
      <input v-model="prorate" type="radio" :value="true" />
    </div>
    <div class="flex-auto">
      <h4 class="font-semibold">Update my contribution now</h4>
      <p class="text-sm">
        You'll be charged a one-off payment of
        {{ n(oneOffPayment, 'currency') }} now and your contribution will be
        updated immediately
      </p>
    </div>
  </label>
  <label class="flex mb-3">
    <div class="flex-none mr-1">
      <input v-model="prorate" type="radio" :value="false" />
    </div>
    <div class="flex-auto">
      <h4 class="font-semibold">Update my contribution later</h4>
      <p class="text-sm">Something else will happen</p>
    </div>
  </label>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { n } = useI18n();

const prorate = ref(true);

const props = defineProps<{
  newAmount: number;
  oldAmount: number;
  monthsLeft: number;
}>();

const oneOffPayment = computed(
  () => ((props.newAmount - props.oldAmount) * props.monthsLeft) / 12
);
</script>
