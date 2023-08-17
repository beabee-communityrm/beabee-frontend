<route lang="yaml">
name: calloutGallery
meta:
  pageTitle: menu.callouts
  noAuth: true
  layout: Fullscreen
</route>

<template>
  <div v-if="callout" class="absolute inset-0 overflow-scroll">
    <ul class="flex flex-wrap m-3">
      <li
        v-for="response in responses"
        :key="response.number"
        class="flex-1 min-w-[250px] sm:max-w-sm p-3"
      >
        <router-link :to="`${hashPrefix}${response.number}`">
          <img
            class="w-full mb-2 aspect-video object-cover"
            loading="lazy"
            :src="response.photos[0].url + '?w=400&h=400'"
          />
          <h2 class="font-title font-bold">{{ response.title }}</h2>
        </router-link>
      </li>
    </ul>

    <div
      v-if="selectedResponse"
      class="fixed inset-0 bg-black/50"
      @click="router.push({ hash: '' })"
    >
      <CalloutResponsePanel
        :callout="callout"
        :response="selectedResponse"
        @close="router.push({ hash: '' })"
        @click.stop
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { fetchCallout, fetchResponsesForMap } from '../../../utils/api/callout';
import {
  GetCalloutDataWith,
  GetCalloutResponseMapData,
} from '../../../utils/api/api.interface';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import CalloutResponsePanel from '../../../components/pages/callouts/CalloutResponsePanel.vue';

const props = defineProps<{ id: string }>();

const route = useRoute();
const router = useRouter();

const callout = ref<GetCalloutDataWith<'form'>>();
const responses = ref<GetCalloutResponseMapData[]>([]);

const hashPrefix = '#response-' as const;

const selectedResponse = computed(() => {
  if (route.hash.startsWith(hashPrefix)) {
    const responseNumber = Number(route.hash.slice(hashPrefix.length));
    return responses.value.find((r) => r.number === responseNumber);
  } else {
    return undefined;
  }
});

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form']);

  // TODO: pagination
  responses.value = (await fetchResponsesForMap(props.id)).items.filter(
    (i) => i.photos.length > 0
  );
});
</script>
