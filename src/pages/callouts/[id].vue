<template>
  <router-view v-if="callout" :callout="callout" />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { GetCalloutDataWith } from '../../utils/api/api.interface';
import { fetchCallout } from '../../utils/api/callout';

const props = defineProps<{ id: string }>();
const callout = ref<GetCalloutDataWith<'form' | 'responseViewSchema'>>();

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form', 'responseViewSchema']);
});
</script>
