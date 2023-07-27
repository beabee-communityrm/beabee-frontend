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
        @map:click="handleClick"
        @map:mousemove="handleMouseOver"
      >
        <MglGeoJsonSource source-id="responses" :data="responsesSource" cluster>
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
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
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
      </MglMap>
    </div>
    <PageTitle :title="callout.title" class="absolute top-8 left-8" />
    <div v-if="selectedResponse" class="absolute left-0 bg-white p-4">
      {{ selectedResponse.properties?.address.formatted_address }}
    </div>
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

const props = defineProps<{ id: string }>();

const map = useMap();
const route = useRoute();
const router = useRouter();

const hashPrefix = '#response-' as const;

const callout = ref<GetCalloutDataWith<'form' | 'mapSchema'>>();
const responses = ref<GetCalloutResponseMapData[]>([]);
const center = ref<LngLatLike>([0, 0]);
const zoom = ref(3);

const selectedResponse = computed(
  () =>
    route.hash.startsWith(hashPrefix) &&
    (responsesSource.value.features[+route.hash.slice(hashPrefix.length)] as
      | GeoJSON.Feature<GeoJSON.Point>
      | undefined)
);

const responsesSource = computed<GeoJSON.FeatureCollection>(() => ({
  type: 'FeatureCollection',
  features: responses.value?.map((response, i) => {
    const { lat, lng } = (
      response.answers.address as {
        geometry: { location: { lat: number; lng: number } };
      }
    ).geometry.location;

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: { id: i, ...response.answers },
    };
  }),
}));

// Zoom to a cluster or open a response
function handleClick(e: { event: MapMouseEvent; map: Map }) {
  const clusterFeatures = e.map.queryRenderedFeatures(e.event.point, {
    layers: ['clusters'],
  });

  if (clusterFeatures.length > 0) {
    const point = clusterFeatures[0] as GeoJSON.Feature<GeoJSON.Point>;
    const source = e.map.getSource('responses') as GeoJSONSource;

    source.getClusterExpansionZoom(
      point.properties?.cluster_id,
      (err, zoom) => {
        if (err || zoom == null) return;

        e.map.easeTo({
          center: point.geometry.coordinates as LngLatLike,
          zoom: zoom,
        });
      }
    );
  } else {
    const pointFeatures = e.map.queryRenderedFeatures(e.event.point, {
      layers: ['unclustered-points'],
    });
    if (pointFeatures.length > 0) {
      router.push({ hash: hashPrefix + pointFeatures[0].properties?.id });
    }
  }
}

// Add a cursor when hovering over a cluster or a point
function handleMouseOver(e: { event: MapMouseEvent; map: Map }) {
  const features = e.map.queryRenderedFeatures(e.event.point, {
    layers: ['clusters', 'unclustered-points'],
  });

  // TODO: debounce or check for change?
  if (features.length > 0) {
    e.map.getCanvas().style.cursor = 'pointer';
  } else {
    e.map.getCanvas().style.cursor = '';
  }
}

watch(selectedResponse, (newResponse) => {
  if (!map.map || !newResponse) return;

  map.map.easeTo({
    center: newResponse.geometry.coordinates as LngLatLike,
    zoom: callout.value?.mapSchema.maxZoom,
  });
});

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form', 'mapSchema']);
  center.value = callout.value.mapSchema.center;
  zoom.value = callout.value.mapSchema.initialZoom;

  // TODO: pagination
  responses.value = (await fetchResponsesForMap(props.id)).items;
});
</script>
