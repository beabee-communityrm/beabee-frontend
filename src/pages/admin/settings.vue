<route lang="yaml">
name: adminSettings
meta:
  role: admin
</route>

<template>
  <PageTitle :title="t('menu.adminSettings')" border />
  <div class="flex gap-8">
    <div class="flex-0 basis-menu">
      <AppVTabs v-model="currentTab" :items="tabs" />
    </div>
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import PageTitle from '../../components/PageTitle.vue';
import AppVTabs from '../../components/tabs/AppVTabs.vue';
import { TabItem } from '../../components/tabs/tabs.interface';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const tabs: TabItem[] = [
  {
    id: 'adminSettingsGeneral',
    label: t('adminSettings.general'),
  },
  {
    id: 'adminSettingsEmail',
    label: t('adminSettings.email'),
  },
  {
    id: 'adminSettingsTheme',
    label: t('adminSettings.theme'),
  },
].map((item) => ({
  ...item,
  to: router.resolve({ name: item.id }).href,
}));

const currentTab = computed({
  get: () => (route.name as string) || '',
  set: (newName) => router.push({ name: newName }),
});
</script>
