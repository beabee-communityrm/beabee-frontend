<route lang="yaml">
name: calloutGallery
meta:
  pageTitle: menu.callouts
  noAuth: true
  layout: Fullscreen
</route>

<template>
  <div v-if="callout">
    <ul class="flex flex-wrap m-2">
      <li
        v-for="response in responses"
        :key="response.number"
        class="flex-initial basis-1/3 p-2"
      >
        <p>{{ response.title }}</p>
        <div v-if="response.photos.length > 0">
          <img
            class="w-full"
            loading="lazy"
            :src="response.photos[0].url + '?w=400&h=400'"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { fetchCallout, fetchResponsesForMap } from '../../../utils/api/callout';
import {
  GetCalloutDataWith,
  GetCalloutResponseMapData,
} from '../../../utils/api/api.interface';

const props = defineProps<{ id: string }>();

const callout = ref<GetCalloutDataWith<'form'>>();
const responses = ref<GetCalloutResponseMapData[]>([]);

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form']);

  // TODO: pagination
  responses.value = (await fetchResponsesForMap(props.id)).items;
});
</script>
