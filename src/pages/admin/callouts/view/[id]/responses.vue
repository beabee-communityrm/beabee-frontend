<route lang="yaml">
name: adminCalloutViewResponses
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template><div></div></template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { GetCalloutData } from '../../../../../utils/api/api.interface';

const props = defineProps<{
  callout: GetCalloutData;
}>();

onBeforeMount(() => {
  window.location.href = '/tools/polls/' + props.callout.slug + '/responses';
});
</script>
