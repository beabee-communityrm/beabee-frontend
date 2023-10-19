<route lang="yaml">
name: calloutThanks
meta:
  pageTitle: menu.callouts
  noAuth: true
  embeddable: true
</route>
<template>
  <CalloutPage :id="id" thanks />
</template>
<script lang="ts" setup>
import CalloutPage from './index.vue';
defineProps<{ id: string }>();
</script>
