<route lang="yaml">
name: calloutGallery
meta:
  pageTitle: menu.callouts
  noAuth: true
  layout: Fullscreen
</route>

<template>
  <div v-if="callout" class="absolute inset-0 flex flex-col">
    <div class="flex-0 p-6 pb-1">
      <PageTitle :title="callout.title" no-collapse>
        <router-link
          v-if="callout.responseViewSchema?.map"
          :to="`/callouts/${callout.slug}/map`"
          class="text-link font-semibold whitespace-nowrap"
        >
          <font-awesome-icon :icon="faMap" /> {{ t('callout.views.map') }}
        </router-link>
      </PageTitle>
    </div>
    <div class="overflow-scroll">
      <ul class="flex flex-wrap m-3 -mt-3">
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
    </div>

    <transition name="response-panel-bg">
      <div
        v-if="selectedResponse"
        class="fixed inset-0 bg-black/50"
        @click="router.push({ hash: '' })"
      />
    </transition>

    <CalloutResponsePanel
      :callout="callout"
      :response="selectedResponse"
      @close="router.push({ hash: '' })"
      @click.stop
    />
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
import PageTitle from '../../../components/PageTitle.vue';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ id: string }>();

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const callout = ref<GetCalloutDataWith<'form' | 'responseViewSchema'>>();
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
  callout.value = await fetchCallout(props.id, ['form', 'responseViewSchema']);

  if (!callout?.value.responseViewSchema?.gallery) {
    throw new Error('Callout does not have a gallery');
  }

  // TODO: pagination
  responses.value = (await fetchResponsesForMap(props.id)).items.filter(
    (i) => i.photos.length > 0
  );
});
</script>

<style lang="postcss" scoped>
.response-panel-bg-enter-active,
.response-panel-bg-leave-active {
  @apply transition-opacity;
}

.response-panel-bg-enter-from,
.response-panel-bg-leave-to {
  @apply opacity-0;
}

.response-panel-bg-enter-to,
.response-panel-bg-leave-from {
  @apply opacity-100;
}
</style>
