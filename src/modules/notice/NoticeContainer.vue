<template>
  <div v-if="notices.length">
    <AppNotice v-for="notice in notices" :key="notice.id" :notice="notice" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import AppNotice from './AppNotice.vue';
import { useNotice } from './use-notice';

const { setNotices, notices } = useNotice();

onMounted(setNotices);
</script>
