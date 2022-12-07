<route lang="yaml">
name: adminMembershipBuilder
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <PageTitle :title="t('membershipBuilder.title')" border />
  <AppTabs :items="tabs" :selected="route.name ? route.name as string : null" />
  <router-view ref="mbRouterView"></router-view>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import AppTabs from '../../components/tabs/AppTabs.vue';
import { TabItem } from '../../components/tabs/tabs.interface';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

// TODO: i18n
const tabs: Ref<TabItem[]> = ref([
  {
    id: 'adminMembershipBuilderJoinForm',
    label: 'Join form',
    to: `/admin/membership-builder/join-form`,
  },
  {
    id: 'adminMembershipBuilderAccountConfirmation',
    label: 'Account confirmation',
    to: `/admin/membership-builder/confirmation`,
  },
  {
    id: 'adminMembershipBuilderIntroMessages',
    label: 'Intro messages',
    to: `/admin/membership-builder/intro`,
  },
  {
    id: 'adminMembershipBuilderEmail',
    label: 'Email notices',
    to: `/admin/membership-builder/email`,
  },
]);
</script>
