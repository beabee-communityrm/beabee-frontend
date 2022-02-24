<template>
  <dd class="text-right text-sm">{{ name }}</dd>
  <dt class="font-bold">
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
const valueWithDefault = computed(() => (props.value ? `${props.value}` : '-'));
</script>
