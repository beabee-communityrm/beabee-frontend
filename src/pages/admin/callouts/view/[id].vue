<route lang="yaml">
name: adminCalloutView
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div v-if="callout">
    <PageTitle class="mb-2" :title="callout.title" no-collapse />
    <AppTabs :items="tabs" :selected="selectedTab" />
    <router-view :callout="callout"></router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import PageTitle from '../../../../components/PageTitle.vue';
import AppTabs from '../../../../components/tabs/AppTabs.vue';
import { GetCalloutDataWith } from '../../../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../../../utils/api/callout';

const props = defineProps<{ id: string }>();

const route = useRoute();
const { t } = useI18n();

const callout = ref<GetCalloutDataWith<'form'>>();
const responseCount = ref(-1);

const tabs = computed(() =>
  callout.value
    ? [
        {
          id: 'overview',
          label: t('calloutAdmin.overview'),
          to: `/admin/callouts/view/${callout.value.slug}`,
        },
        {
          id: 'responses',
          label: t('calloutAdmin.responses'),
          to: `/admin/callouts/view/${callout.value.slug}/responses`,
          ...(responseCount.value > -1 && {
            count: responseCount.value.toLocaleString(),
          }),
        },
      ]
    : []
);

const selectedTab = computed(() =>
  route.name
    ? (route.name as string).startsWith('adminCalloutViewResponses')
      ? 'responses'
      : 'overview'
    : null
);

onBeforeMount(async () => {
  callout.value = await fetchCallout(props.id, ['form']);
  responseCount.value = (await fetchResponses(props.id, { limit: 1 })).total;
});
</script>
