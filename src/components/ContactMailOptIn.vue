<template>
  <p class="mb-1 text-lg">
    {{ content.mailTitle }}
  </p>

  <p class="mb-4 text-sm">
    {{ content.mailText }}
  </p>

  <AppCheckbox
    v-model="optIn"
    :label="content.mailOptIn"
    class="mb-4 font-bold"
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import AppCheckbox from './forms/AppCheckbox.vue';

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
