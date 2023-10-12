<route lang="yaml">
name: adminUiToolkit
meta:
  pageTitle: menu.uiToolkit
  role: admin
</route>

<template>
  <PageTitle :title="t('menu.uiToolkit')" />
  <div class="grid md:grid-cols-2 md:gap-12 lg:grid-cols-3">
    <AppHeading>{{ t('uiToolkit.typography.title') }}</AppHeading>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../../components/PageTitle.vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppSubHeading from '../../../components/AppSubHeading.vue';

const { t } = useI18n();
</script>
