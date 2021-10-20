<template>
  <component :is="layout" v-if="layout" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { shallowRef } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';

const route = useRoute();

const layout = shallowRef();

watch(
  () => route.meta,
  async (meta) => {
    try {
      const layoutName = meta.layout ? meta.layout : 'Dashboard';
      const component = await import(`./${layoutName}Layout.vue`);
      layout.value = component.default;
    } catch (e) {}
  }
);
</script>
