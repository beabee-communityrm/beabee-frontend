<route lang="yaml">
name: adminSettings
meta:
  role: admin
</route>

<template>
  <PageTitle :title="t('menu.adminSettings')" />
  <AppTabs :items="tabs" :selected="(route.name as string) || ''" />
  <router-view />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PageTitle from '../../components/PageTitle.vue';
import { TabItem } from '../../components/tabs/tabs.interface';
import AppTabs from '../../components/tabs/AppTabs.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const tabs: TabItem[] = [
  {
    id: 'adminSettingsGeneral',
    label: t('adminSettings.general.label'),
  },
  {
    id: 'adminSettingsEmail',
    label: t('adminSettings.email.label'),
  },
  {
    id: 'adminSettingsTheme',
    label: t('adminSettings.theme.label'),
  },
].map((item) => ({
  ...item,
  to: router.resolve({ name: item.id }).href,
}));
</script>
