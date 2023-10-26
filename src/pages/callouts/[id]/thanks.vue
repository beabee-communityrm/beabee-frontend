<route lang="yaml">
name: calloutThanks
meta:
  pageTitle: menu.callouts
  noAuth: true
  embeddable: true
</route>
<template>
  <CalloutPage :callout="callout" thanks />
</template>
<script lang="ts" setup>
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import CalloutPage from './index.vue';
defineProps<{
  callout: GetCalloutDataWith<'form' | 'responseViewSchema'>;
}>();
</script>
