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
    <div class="flex-0 p-6 pb-1 shadow-lg z-10">
      <PageTitle :title="callout.title" no-collapse>
        <router-link
          v-if="callout.responseViewSchema.gallery"
          :to="`/callouts/${callout.slug}/gallery`"
          class="text-link font-semibold whitespace-nowrap"
        >
          <font-awesome-icon :icon="faImages" />
          {{ t('callout.views.gallery') }}
        </router-link>
      </PageTitle>
    </div>
    <div class="flex-1 relative">
      <MglMap
        :center="callout.responseViewSchema.map.center"
        :zoom="callout.responseViewSchema.map.initialZoom"
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
        <MglMarker
          v-if="newResponseAnswers?.address?.geometry"
          :coordinates="newResponseAnswers.address.geometry.location"
        >
          <div class="w-8 h-8 bg-primary rounded-full" />
        </MglMarker>
      </MglMap>

      <transition name="add-notice">
        <div
          v-if="isAddMode && !newResponseAnswers"
          class="absolute top-10 md:top-20 inset-x-0 flex justify-center"
        >
          <p class="bg-white p-4 font-bold rounded shadow-lg mx-4">
            <font-awesome-icon :icon="faInfoCircle" class="mr-1" />
            Click on the map where you want to add a point
          </p>
        </div>
      </transition>
      <button
        v-if="isOpen && !isAddMode"
        class="absolute bottom-8 right-8 rounded-full bg-primary w-20 h-20 text-white shadow-md"
        @click="handleStartAddMode"
      >
        <font-awesome-icon :icon="faPlus" class="text-4xl" />
      </button>
    </div>

    <!-- Side panel width reference to offset map center -->
    <div ref="sidePanelRef" class="absolute left-0 w-full max-w-lg" />

    <CalloutShowResponsePanel
      :callout="callout"
      :response="selectedResponseFeature?.properties"
      @close="router.push({ hash: '' })"
    />

    <CalloutAddResponsePanel
      :callout="callout"
      :answers="newResponseAnswers"
      @close="handleCancelAddMode"
    />
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
  MglMarker,
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
import CalloutShowResponsePanel from '../../../components/pages/callouts/CalloutShowResponsePanel.vue';
import {
  CalloutResponseAnswerAddress,
  CalloutResponseAnswers,
} from '@beabee/beabee-common';
import {
  faImages,
  faInfoCircle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import {
  HASH_PREFIX,
  useCallout,
} from '../../../components/pages/callouts/use-callout';
import { reverseGeocode } from '../../../utils/geocode';
import CalloutAddResponsePanel from '../../../components/pages/callouts/CalloutAddResponsePanel.vue';

const props = defineProps<{ id: string }>();

const map = useMap();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const sidePanelRef = ref<HTMLElement>();

const callout = ref<GetCalloutDataWith<'form' | 'responseViewSchema'>>();
const responses = ref<GetCalloutResponseMapData[]>([]);

const { isOpen } = useCallout(callout);

const isAddMode = ref(false);
const newResponseAnswers = ref<
  CalloutResponseAnswers & {
    address?: CalloutResponseAnswerAddress | Record<string, never>;
  }
>();

// A GeoJSON FeatureCollection of all the responses
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

// A GeoJSON Feature of the currently selected response
const selectedResponseFeature = computed(() => {
  if (route.hash.startsWith(HASH_PREFIX)) {
    const responseNumber = Number(route.hash.slice(HASH_PREFIX.length));
    return responsesCollecton.value.features.find(
      (f) => f.properties.number === responseNumber
    );
  } else {
    return undefined;
  }
});

// Zoom to a cluster or open a response
function handleClick(e: { event: MapMouseEvent; map: Map }) {
  if (isAddMode.value) {
    if (!newResponseAnswers.value) {
      handleAddClick(e);
    }
    return;
  }

  // Not loaded yet
  if (!e.map.getLayer('clusters')) return;

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
          zoom: zoom + 1,
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
          ? HASH_PREFIX + pointFeatures[0].properties.number
          : '',
    });
  }
}

// Add a cursor when hovering over a cluster or a point
function handleMouseOver(e: { event: MapMouseEvent; map: Map }) {
  if (isAddMode.value) return;

  // Not loaded yet
  if (!e.map.getLayer('clusters')) return;

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

// Start add response mode
function handleStartAddMode() {
  if (!map.map) return;
  isAddMode.value = true;
  map.map.getCanvas().style.cursor = 'crosshair';
  router.push({ hash: '' });
}

// Cancel add response mode, clearing any state that is left over
function handleCancelAddMode() {
  if (!map.map) return;
  isAddMode.value = false;
  newResponseAnswers.value = undefined;
  map.map.getCanvas().style.cursor = '';
}

// Geolocate where the user has clicked
async function handleAddClick(e: { event: MapMouseEvent; map: Map }) {
  const coords = e.event.lngLat;
  e.map.getCanvas().style.cursor = '';

  e.map.easeTo({
    center: coords,
    padding: { left: sidePanelRef.value?.offsetWidth || 0 },
  });

  const result = await reverseGeocode(coords.lat, coords.lng);
  const addressPattern = '{street_number} {route}, {locality} {postal_code}';

  const addressText = result
    ? addressPattern.replace(
        /{(\w+)}/g,
        (match, key) =>
          result.address_components.find((a) => a.types.includes(key))
            ?.long_name ?? '???'
      )
    : '';

  newResponseAnswers.value = {
    // TODO: dynamic address
    address: result,
    address1: addressText,
  };
}

// Centre map on selected feature when it changes
watch(selectedResponseFeature, (newFeature) => {
  if (!map.map || !newFeature) return;

  map.map.easeTo({
    center: newFeature.geometry.coordinates as LngLatLike,
    padding: { left: sidePanelRef.value?.offsetWidth || 0 },
  });
});

// Load callout and responses
onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form', 'responseViewSchema']);
  if (!callout.value.responseViewSchema?.map) {
    throw new Error('Callout does not have a map schema');
  }

  // TODO: pagination
  responses.value = (await fetchResponsesForMap(props.id)).items;
});
</script>

<style lang="postcss" scoped>
.add-notice-enter-active,
.add-notice-leave-active {
  @apply transition;
}

.add-notice-enter-from,
.add-notice-leave-to {
  @apply opacity-0 -translate-y-8;
}

.add-notice-enter-to,
.add-notice-leave-from {
  @apply opacity-100 translate-y-0;
}
</style>
