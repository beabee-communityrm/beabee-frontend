<template>
  <section v-if="notices.length">
    <AppNotice v-for="notice in notices" :key="notice.id" :notice="notice" />
  </section>
</template>

<script lang="ts" setup>
import { onBeforeMount } from '@vue/runtime-core';
import AppNotice from './AppNotice.vue';
import { useNotice } from './use-notice';

const { setNotices, notices } = useNotice();

onBeforeMount(() => {
  setNotices();
});
</script>
