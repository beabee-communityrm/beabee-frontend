<template>
  <router-view v-if="callout" :callout="callout" />
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCallout } from '@utils/api/callout';
import type { GetCalloutDataWith } from '@type';

const props = defineProps<{ id: string }>();
const callout =
  ref<GetCalloutDataWith<'form' | 'responseViewSchema' | 'variantNames'>>();

const route = useRoute();

watchEffect(async () => {
  // callout.value = undefined;
  callout.value = await fetchCallout(
    props.id,
    ['form', 'responseViewSchema', 'variantNames'],
    route.query.lang ? route.query.lang.toString() : undefined
  );
});
</script>
