<template>
  <p class="text-lg mb-1">
    {{ content.mailTitle }}
  </p>

  <p class="mb-4 text-sm">
    {{ content.mailText }}
  </p>

  <div class="mb-4">
    <input id="deliveryOptIn" v-model="optIn" type="checkbox" name="updates" />

    <label for="deliveryOptIn" class="font-bold ml-1">
      {{ content.mailOptIn }}
    </label>
  </div>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: boolean;
  content: {
    mailTitle: string;
    mailText: string;
    mailOptIn: string;
  };
}>();

const optIn = computed({
  get: () => props.modelValue,
  set: (newOptIn) => emit('update:modelValue', newOptIn),
});
</script>
