<template>
  <template v-if="callout">
    <div class="mb-2">
      <h1 class="text-2xl">{{ callout.title }}</h1>
    </div>

    <AppTabs
      :items="tabs"
      :selected="route.name ? route.name as string : null"
    />

    <router-view :callout="callout"></router-view>
  </template>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AppTabs from '../../../components/tabs/AppTabs.vue';
import { GetBasicCalloutData } from '../../../utils/api/api.interface';
import { fetchCallout } from '../../../utils/api/callout';

const route = useRoute();

const { t } = useI18n();

const tabs = computed(() =>
  callout.value
    ? [
        {
          id: 'calloutAdminOverview',
          label: t('calloutAdmin.overview'),
          to: `/admin/callouts/${callout.value.slug}`,
        },
        {
          id: 'calloutAdminResponses',
          label: t('calloutAdmin.responses'),
          to: `/admin/callouts/${callout.value.slug}/responses`,
        },
      ]
    : []
);

const callout = ref<GetBasicCalloutData>();

onBeforeMount(async () => {
  callout.value = await fetchCallout(route.params.id as string);
});
</script>
