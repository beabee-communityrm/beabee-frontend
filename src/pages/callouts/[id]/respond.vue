<route lang="yaml">
name: calloutRespond
meta:
  pageTitle: menu.callouts
  noAuth: true
</route>
<template>
  <CalloutPage :id="id" respond />
</template>
<script lang="ts" setup>
import CalloutPage from './index.vue';
defineProps<{ id: string }>();
</script>
