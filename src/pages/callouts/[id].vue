<template>
  <router-view v-if="callout" :callout="callout" />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCallout } from '@utils/api/callout';
import type { GetCalloutDataWith } from '@type';

const props = defineProps<{ id: string }>();
const callout = ref<GetCalloutDataWith<'form' | 'responseViewSchema'>>();

const route = useRoute();

onBeforeMount(async () => {
  callout.value = await fetchCallout(
    props.id,
    ['form', 'responseViewSchema'],
    route.query.lang ? route.query.lang.toString() : undefined
  );
});
</script>
