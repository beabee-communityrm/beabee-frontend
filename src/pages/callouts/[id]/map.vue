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
        <MglGeoJsonSource
          source-id="responses"
          :data="responsesSource"
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
          v-if="selectedResponse"
          source-id="selected-response"
          :data="selectedResponse"
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

    <PageTitle :title="callout.title" class="absolute top-8 left-8" />

    <aside
      v-if="selectedResponse"
      class="absolute left-0 inset-y-0 bg-white p-8 w-full max-w-lg overflow-scroll shadow-lg"
    >
      <button
        class="absolute right-2 top-2 h-10 w-10 hover:text-primary text-2xl"
        type="button"
        @click="router.push({ hash: '' })"
      >
        <font-awesome-icon :icon="faTimes" />
      </button>
      <div
        v-if="selectedPhotos.length > 0"
        class="relative overflow-hidden mb-4 -mx-4"
      >
        <ul
          class="flex items-center transition-transform"
          :style="{ transform: `translateX(${currentPhotoIndex * -100}%)` }"
        >
          <li
            v-for="photo in selectedPhotos"
            :key="photo.url"
            class="w-full flex-none p-4"
          >
            <img class="w-full" :src="photo.url + '?w=600&h=600'" />
          </li>
        </ul>
        <div
          v-if="selectedPhotos.length > 1"
          class="absolute top-1/2 inset-x-0 flex justify-between text-2xl font-bold transform -translate-y-1/2"
        >
          <div>
            <button
              v-show="currentPhotoIndex > 0"
              class="bg-primary text-white w-10 h-10 rounded-full"
              @click="currentPhotoIndex--"
            >
              <font-awesome-icon :icon="faChevronLeft" />
            </button>
          </div>
          <div>
            <button
              v-show="currentPhotoIndex < selectedPhotos.length - 1"
              class="bg-primary text-white w-10 h-10 rounded-full"
              @click="currentPhotoIndex++"
            >
              <font-awesome-icon :icon="faChevronRight" />
            </button>
          </div>
        </div>
      </div>
      <Form
        :key="selectedResponse.properties?.id"
        class="callout-form-simple"
        :form="callout.formSchema"
        :submission="{ data: selectedResponse.properties }"
        :options="{ readOnly: true, noAlerts: true, renderMode: 'html' }"
      />
    </aside>
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
import { Form } from '@formio/vue';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'vue-maplibre-gl/dist/vue-maplibre-gl.css';
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{ id: string }>();

const map = useMap();
const route = useRoute();
const router = useRouter();

const hashPrefix = '#response-' as const;

const titleProp = '';
const photosProp = 'file';

const sidePanelRef = ref<HTMLElement>();
const callout = ref<GetCalloutDataWith<'form' | 'mapSchema'>>();
const responses = ref<GetCalloutResponseMapData[]>([]);
const center = ref<LngLatLike>([0, 0]);
const zoom = ref(3);

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

const selectedResponse = computed(
  () =>
    route.hash.startsWith(hashPrefix) &&
    (responsesSource.value.features[+route.hash.slice(hashPrefix.length)] as
      | GeoJSON.Feature<GeoJSON.Point>
      | undefined)
);

const selectedPhotos = computed<any[]>(
  () =>
    (selectedResponse.value &&
      selectedResponse.value.properties?.[photosProp]) ||
    []
);

const currentPhotoIndex = ref(0);
watch(selectedPhotos, () => {
  currentPhotoIndex.value = 0;
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
            ? hashPrefix + pointFeatures[0].properties?.id
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

watch(selectedResponse, (newResponse) => {
  if (!map.map || !newResponse) return;

  map.map.easeTo({
    center: newResponse.geometry.coordinates as LngLatLike,
    padding: { left: sidePanelRef.value?.offsetWidth || 0 },
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

<style>
.callout-form-simple {
  .form-group {
    @apply mb-1;
  }

  .formio-component-file {
    @apply hidden;
  }

  .col-form-label {
    @apply float-left flex font-bold mr-2;
    &::after {
      content: ': ';
    }
  }
}
</style>
