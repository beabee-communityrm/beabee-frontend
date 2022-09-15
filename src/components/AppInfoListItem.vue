<template>
  <dd class="md:text-right text-sm font-semibold text-body-80">{{ name }}</dd>
  <dt class="text-right md:text-left font-bold">
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
