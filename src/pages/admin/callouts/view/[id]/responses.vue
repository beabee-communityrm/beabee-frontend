<route lang="yaml">
name: adminCalloutViewResponsesWrapper
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template><router-view :callout="callout" /></template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { addBreadcrumb } from '../../../../../store/breadcrumb';
import { GetCalloutDataWith } from '../../../../../utils/api/api.interface';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();
const { t } = useI18n();

addBreadcrumb(
  computed(() => [
    {
      title: t('calloutAdmin.responses'),
      to: `/admin/callouts/view/${props.callout.slug}/responses`,
    },
  ])
);
</script>
