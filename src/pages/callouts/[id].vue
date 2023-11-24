<template>
  <router-view v-if="callout" :callout="callout" />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { fetchCallout } from '@utils/api/callout';
import type { GetCalloutDataWith } from '@type';

const props = defineProps<{ id: string }>();
const callout = ref<GetCalloutDataWith<'form' | 'responseViewSchema'>>();

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form', 'responseViewSchema']);
});
</script>
