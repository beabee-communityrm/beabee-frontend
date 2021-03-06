<template>
  <template v-if="callout">
    <PageTitle class="mb-2" :title="callout.title" no-collapse />

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
import PageTitle from '../../../components/PageTitle.vue';
import AppTabs from '../../../components/tabs/AppTabs.vue';
import { GetMoreCalloutData } from '../../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../../utils/api/callout';

const route = useRoute();

const { t } = useI18n();

const callout = ref<GetMoreCalloutData>();
const responseCount = ref(-1);

const tabs = computed(() =>
  callout.value
    ? [
        {
          id: 'calloutAdminOverview',
          label: t('calloutAdmin.overview'),
          to: `/admin/callouts/view/${callout.value.slug}`,
        },
        {
          id: 'calloutAdminResponses',
          label: t('calloutAdmin.responses'),
          to: `/admin/callouts/view/${callout.value.slug}/responses`,
          ...(responseCount.value > -1 && {
            count: responseCount.value.toLocaleString(),
          }),
        },
      ]
    : []
);

onBeforeMount(async () => {
  const calloutId = route.params.id.toString();
  callout.value = await fetchCallout(calloutId);
  responseCount.value = (await fetchResponses(calloutId, { limit: 1 })).total;
});
</script>
