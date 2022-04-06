<template><div></div></template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { GetMoreCalloutData } from '../../../utils/api/api.interface';

const props = defineProps<{
  callout: GetMoreCalloutData;
}>();

onBeforeMount(() => {
  window.location.href = '/tools/polls/' + props.callout.slug + '/responses';
});
</script>
