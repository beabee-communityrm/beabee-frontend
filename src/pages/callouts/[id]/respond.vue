<route lang="yaml">
name: calloutRespond
meta:
  pageTitle: menu.callouts
  noAuth: true
</route>
<template>
  <CalloutPage :callout="callout" respond />
</template>
<script lang="ts" setup>
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import CalloutPage from './index.vue';
defineProps<{
  callout: GetCalloutDataWith<'form' | 'responseViewSchema'>;
}>();
</script>
