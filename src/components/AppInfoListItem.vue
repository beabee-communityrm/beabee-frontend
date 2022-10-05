<template>
  <dd class="text-sm font-semibold text-body-80 md:text-right">{{ name }}</dd>
  <dt class="text-right font-bold md:text-left">
    <slot>
      {{ valueWithDefault }}
    </slot>
  </dt>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';
const props = defineProps<{
  name: string;
  value?: unknown;
}>();
const valueWithDefault = computed(() => (props.value ? `${props.value}` : '–'));
</script>
