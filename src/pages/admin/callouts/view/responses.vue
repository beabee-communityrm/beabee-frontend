<route lang="yaml">
name: adminCalloutViewResponses
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template><router-view :callout="callout" /></template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { addBreadcrumb } from '../../../../store/breadcrumb';
import { GetCalloutDataWith } from '../../../../utils/api/api.interface';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();
const { t } = useI18n();

addBreadcrumb(
  computed(() => [
    { title: t('menu.callouts'), icon: faBullhorn, to: '/admin/callouts' },
    {
      title: props.callout.title || '',
      to: `/admin/callouts/view/${props.callout.slug}`,
    },
    {
      title: t('calloutAdmin.responses'),
      to: `/admin/callouts/view/${props.callout.slug}/responses`,
    },
  ])
);
</script>
