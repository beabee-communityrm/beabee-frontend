<template>
  <a v-if="isExternalLink" v-bind="$attrs" target="_blank" :href="props.to"
    ><slot
  /></a>

  <router-link
    v-else
    v-slot="{ href, navigate }"
    :to="props.to"
    v-bind="$props"
    custom
  >
    <a :href="href" v-bind="$attrs" @click="navigate"><slot /></a>
  </router-link>
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { RouterLink } from 'vue-router';

const props = defineProps({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...RouterLink.props,
});

const isExternalLink = computed(() => {
  const regex = /^[a-z]+:/;
  return typeof props.to === 'string' && regex.test(props.to);
});
</script>
