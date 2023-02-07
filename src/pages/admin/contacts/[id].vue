<route lang="yaml">
name: adminContactsView
meta:
  pageTitle: menu.contacts
  role: admin
</route>

<template>
  <template v-if="contact">
    <PageTitle
      class="mb-2"
      :title="
        `${contact.firstname} ${contact.lastname}`.trim() || contact.email
      "
      no-collapse
    />

    <AppTabs
      :items="tabs"
      :selected="route.name ? route.name as string : null"
    />

    <router-view :contact="contact"></router-view>
  </template>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import PageTitle from '../../../components/PageTitle.vue';
import { GetContactData } from '../../../utils/api/api.interface';
import { fetchContact } from '../../../utils/api/contact';
import AppTabs from '../../../components/tabs/AppTabs.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ id: string }>();
const route = useRoute();
const { t } = useI18n();

const contact = ref<GetContactData | undefined>();

const tabs = computed(() =>
  contact.value
    ? [
        {
          id: 'adminContactsViewOverview',
          label: t('contactOverview.overview'),
          to: `/admin/contacts/${contact.value.id}`,
        },
        {
          id: 'adminContactsViewAccount',
          label: t('contactOverview.account'),
          to: `/admin/contacts/${contact.value.id}/account`,
        },
        {
          id: 'adminContactsViewContribution',
          label: t('contactOverview.contribution'),
          to: `/admin/contacts/${contact.value.id}/contribution`,
        },
        {
          id: 'adminContactsViewCallouts',
          label: t('contactOverview.callouts'),
          to: `/admin/contacts/${contact.value.id}/callouts`,
        },
      ]
    : []
);

onBeforeMount(async () => {
  contact.value = await fetchContact(props.id as string);
});
</script>
