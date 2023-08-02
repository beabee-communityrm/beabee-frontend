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
    <div
      v-if="selectedResponse"
      class="absolute left-0 top-0 bottom-0 bg-white p-8 max-w-lg w-[40%] overflow-scroll shadow-lg"
    >
      <div class="callout-form-map">
        <div
          v-if="selectedPhotos.length > 0"
          class="relative overflow-hidden mb-4"
        >
          {{ currentPhotoIndex }}
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
            class="absolute top-1/2 inset-x-0 flex justify-between text-4xl font-bold transform -translate-y-1/2"
          >
            <div>
              <button
                class="bg-primary text-white w-12 h-12 rounded-full"
                :class="currentPhotoIndex === 0 ? 'hidden' : ''"
                @click="currentPhotoIndex--"
              >
                <font-awesome-icon :icon="faChevronLeft" />
              </button>
            </div>
            <div>
              <button
                class="bg-primary text-white w-12 h-12 rounded-full"
                :class="
                  currentPhotoIndex === selectedPhotos.length - 1
                    ? 'hidden'
                    : ''
                "
                @click="currentPhotoIndex++"
              >
                <font-awesome-icon :icon="faChevronRight" />
              </button>
            </div>
          </div>
        </div>
        <Form
          :key="selectedResponse.properties?.id"
          :form="callout.formSchema"
          :submission="{ data: selectedResponse.properties }"
          :options="{ readOnly: true, noAlerts: true, renderMode: 'html' }"
        />
      </div>
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
import { Form } from 'vue-formio';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'vue-maplibre-gl/dist/vue-maplibre-gl.css';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{ id: string }>();

const map = useMap();
const route = useRoute();
const router = useRouter();

const hashPrefix = '#response-' as const;

const titleProp = '';
const photosProp = 'file';

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
  if (!e.map.loaded()) return;

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
  if (!e.map.loaded()) return;

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

<style>
.callout-form-map {
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
