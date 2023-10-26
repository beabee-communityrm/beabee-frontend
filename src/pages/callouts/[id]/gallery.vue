<route lang="yaml">
name: calloutGallery
meta:
  pageTitle: menu.callouts
  noAuth: true
  layout: Fullscreen
  embeddable: true
</route>

<template>
  <div class="absolute inset-0 flex flex-col">
    <div v-if="!isEmbed" class="flex-0 p-6 pb-1 z-10 shadow-lg">
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
      <ul class="flex flex-wrap m-3">
        <li
          v-for="response in responses"
          :key="response.number"
          class="flex-1 min-w-[250px] sm:max-w-sm p-3"
        >
          <router-link
            :to="`${HASH_PREFIX}${response.number}`"
            @click="introOpen = false"
          >
            <img
              class="w-full mb-2 aspect-video object-cover"
              loading="lazy"
              :style="{ filter: callout.responseViewSchema?.imageFilter }"
              :src="response.photos[0].url + '?w=400&h=400'"
            />
            <h2>{{ response.title }}</h2>
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

    <CalloutShowResponsePanel
      :callout="callout"
      :response="selectedResponse"
      @close="
        router.push({ hash: '' });
        introOpen = false;
      "
      @click.stop
    />

    <CalloutIntroPanel
      v-if="!isEmbed"
      :callout="callout"
      :show="introOpen && !selectedResponse"
      @close="introOpen = false"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { fetchResponsesForMap } from '../../../utils/api/callout';
import {
  GetCalloutDataWith,
  GetCalloutResponseMapData,
} from '../../../utils/api/api.interface';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import CalloutShowResponsePanel from '../../../components/pages/callouts/CalloutShowResponsePanel.vue';
import CalloutIntroPanel from '../../../components/pages/callouts/CalloutIntroPanel.vue';
import PageTitle from '../../../components/PageTitle.vue';
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import { isEmbed } from '../../../store';

const HASH_PREFIX = '#response-' as const;

const props = defineProps<{
  callout: GetCalloutDataWith<'form' | 'responseViewSchema'>;
  // Suppress the warning about the ID prop being passed by the router
  id: string;
}>();

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const responses = ref<GetCalloutResponseMapData[]>([]);

const introOpen = ref(true);

const selectedResponse = computed(() => {
  if (route.hash.startsWith(HASH_PREFIX)) {
    const responseNumber = Number(route.hash.slice(HASH_PREFIX.length));
    return responses.value.find((r) => r.number === responseNumber);
  } else {
    return undefined;
  }
});

onBeforeMount(async () => {
  if (!props.callout.responseViewSchema?.gallery) {
    throw new Error('Callout does not have a gallery');
  }

  // TODO: pagination
  responses.value = (
    await fetchResponsesForMap(props.callout.slug)
  ).items.filter((i) => i.photos.length > 0);
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
