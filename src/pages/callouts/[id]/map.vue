<route lang="yaml">
name: calloutMap
meta:
  pageTitle: menu.callouts
  noAuth: true
  layout: Fullscreen
</route>

<template>
  <div v-if="callout">
    <div class="absolute inset-0">
      <MglMap
        :center="center"
        :zoom="zoom"
        :map-style="callout.mapSchema.style"
        :max-zoom="callout.mapSchema.maxZoom"
        :min-zoom="callout.mapSchema.minZoom"
      />
    </div>
    <PageTitle :title="callout.title" class="absolute top-8 left-8" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../../utils/api/callout';
import { MglMap } from 'vue-maplibre-gl';
import { LngLatLike } from 'maplibre-gl';
import PageTitle from '../../../components/PageTitle.vue';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'vue-maplibre-gl/dist/vue-maplibre-gl.css';

const props = defineProps<{ id: string }>();

const callout = ref<GetCalloutDataWith<'form' | 'mapSchema'>>();
const center = ref<LngLatLike>([0, 0]);
const zoom = ref(3);

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form', 'mapSchema']);
  const responses = await fetchResponses(props.id);
  center.value = callout.value.mapSchema.center;
  zoom.value = callout.value.mapSchema.initialZoom;
});
</script>
