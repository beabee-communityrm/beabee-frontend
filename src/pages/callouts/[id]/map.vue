<route lang="yaml">
name: calloutMap
meta:
  pageTitle: menu.callouts
  noAuth: true
  layout: Fullscreen
</route>

<template>
  <div
    v-if="callout?.responseViewSchema?.map"
    class="absolute inset-0 flex flex-col"
  >
    <div class="flex-0 p-6 pb-1">
      <PageTitle :title="callout.title" no-collapse>
        <router-link
          v-if="callout.responseViewSchema.gallery"
          :to="`/callouts/${callout.slug}/gallery`"
          class="text-link font-semibold"
        >
          <font-awesome-icon :icon="faImages" /> Gallery
        </router-link>
      </PageTitle>
    </div>
    <div class="flex-1">
      <MglMap
        :center="center"
        :zoom="zoom"
        :map-style="callout.responseViewSchema.map.style"
        :max-zoom="callout.responseViewSchema.map.maxZoom"
        :min-zoom="callout.responseViewSchema.map.minZoom"
        :max-bounds="callout.responseViewSchema.map.bounds"
        @map:click="handleClick"
        @map:mousemove="handleMouseOver"
      >
        <MglGeoJsonSource
          source-id="responses"
          :data="responsesCollecton"
          cluster
          :cluster-max-zoom="12"
        >
          <MglCircleLayer
            layer-id="clusters"
            :filter="['has', 'point_count']"
            :paint="{
              'circle-color': 'black',
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40,
              ],
            }"
          />
          <MglSymbolLayer
            layer-id="cluster-counts"
            :filter="['has', 'point_count']"
            :paint="{ 'text-color': 'white' }"
            :layout="{
              'text-field': '{point_count_abbreviated}',
              'text-size': 16,
            }"
          />
          <MglCircleLayer
            layer-id="unclustered-points"
            :filter="['!', ['has', 'point_count']]"
            :paint="{
              'circle-color': 'black',
              'circle-radius': 10,
            }"
          />
        </MglGeoJsonSource>
        <MglGeoJsonSource
          v-if="selectedResponseFeature"
          source-id="selected-response"
          :data="selectedResponseFeature"
        >
          <MglCircleLayer
            layer-id="selected-response"
            :paint="{
              'circle-stroke-color': 'red',
              'circle-stroke-width': 2,
              'circle-color': 'transparent',
              'circle-radius': 20,
            }"
          />
        </MglGeoJsonSource>
      </MglMap>
    </div>

    <CalloutResponsePanel
      :callout="callout"
      :response="selectedResponseFeature?.properties"
      @close="router.push({ hash: '' })"
    />

    <!-- Side panel width reference to offset map center -->
    <div ref="sidePanelRef" class="absolute left-0 w-full max-w-lg" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  MglMap,
  MglGeoJsonSource,
  MglCircleLayer,
  MglSymbolLayer,
  useMap,
} from 'vue-maplibre-gl';
import type {
  GeoJSONSource,
  LngLatLike,
  Map,
  MapMouseEvent,
} from 'maplibre-gl';
import type GeoJSON from 'geojson';
import {
  GetCalloutDataWith,
  GetCalloutResponseMapData,
} from '../../../utils/api/api.interface';
import { fetchCallout, fetchResponsesForMap } from '../../../utils/api/callout';
import PageTitle from '../../../components/PageTitle.vue';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'vue-maplibre-gl/dist/vue-maplibre-gl.css';
import CalloutResponsePanel from '../../../components/pages/callouts/CalloutResponsePanel.vue';
import { CalloutResponseAnswerAddress } from '@beabee/beabee-common';
import { faImages } from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{ id: string }>();

const map = useMap();
const route = useRoute();
const router = useRouter();

const hashPrefix = '#response-' as const;

const sidePanelRef = ref<HTMLElement>();
const callout = ref<GetCalloutDataWith<'form' | 'responseViewSchema'>>();
const responses = ref<GetCalloutResponseMapData[]>([]);
const center = ref<LngLatLike>([0, 0]);
const zoom = ref(3);

const responsesCollecton = computed<
  GeoJSON.FeatureCollection<GeoJSON.Point, GetCalloutResponseMapData>
>(() => ({
  type: 'FeatureCollection',
  features: responses.value.map((response) => {
    const address = response.answers.address as CalloutResponseAnswerAddress;
    const { lat, lng } = address.geometry.location;

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: response,
    };
  }),
}));

const selectedResponseFeature = computed(() => {
  if (route.hash.startsWith(hashPrefix)) {
    const responseNumber = Number(route.hash.slice(hashPrefix.length));
    return responsesCollecton.value.features.find(
      (f) => f.properties.number === responseNumber
    );
  } else {
    return undefined;
  }
});

// Zoom to a cluster or open a response
function handleClick(e: { event: MapMouseEvent; map: Map }) {
  try {
    const clusterPoints = e.map.queryRenderedFeatures(e.event.point, {
      layers: ['clusters'],
    }) as GeoJSON.Feature<GeoJSON.Point>[];

    if (clusterPoints.length > 0) {
      const firstPoint = clusterPoints[0] as GeoJSON.Feature<GeoJSON.Point>;
      const source = e.map.getSource('responses') as GeoJSONSource;

      source.getClusterExpansionZoom(
        firstPoint.properties?.cluster_id,
        (err, zoom) => {
          if (err || zoom == null) return;

          e.map.easeTo({
            center: firstPoint.geometry.coordinates as LngLatLike,
            zoom: zoom + 1.5,
          });
        }
      );
    } else {
      const pointFeatures = e.map.queryRenderedFeatures(e.event.point, {
        layers: ['unclustered-points'],
      });

      router.push({
        hash:
          pointFeatures.length > 0
            ? hashPrefix + pointFeatures[0].properties.number
            : '',
      });
    }
  } catch (err) {
    // Map probably isn't loaded loaded yet
  }
}

// Add a cursor when hovering over a cluster or a point
function handleMouseOver(e: { event: MapMouseEvent; map: Map }) {
  try {
    const features = e.map.queryRenderedFeatures(e.event.point, {
      layers: ['clusters', 'unclustered-points'],
    });

    // TODO: debounce or check for change?
    if (features.length > 0) {
      e.map.getCanvas().style.cursor = 'pointer';
    } else {
      e.map.getCanvas().style.cursor = '';
    }
  } catch (err) {
    // Map probably isn't loaded loaded yet
  }
}

watch(selectedResponseFeature, (newFeature) => {
  if (!map.map || !newFeature) return;

  map.map.easeTo({
    center: newFeature.geometry.coordinates as LngLatLike,
    padding: { left: sidePanelRef.value?.offsetWidth || 0 },
  });
});

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form', 'responseViewSchema']);
  if (!callout.value.responseViewSchema?.map) {
    throw new Error('Callout does not have a map schema');
  }

  center.value = callout.value.responseViewSchema.map.center;
  zoom.value = callout.value.responseViewSchema.map.initialZoom;

  // TODO: pagination
  responses.value = (await fetchResponsesForMap(props.id)).items;
});
</script>
