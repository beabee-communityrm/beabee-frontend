<route lang="yaml">
name: adminContactsView
meta:
  pageTitle: menu.community
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
import { GetMemberData } from '../../../utils/api/api.interface';
import { fetchMember } from '../../../utils/api/member';
import AppTabs from '../../../components/tabs/AppTabs.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ id: string }>();
const route = useRoute();
const { t } = useI18n();

const contact = ref<GetMemberData | undefined>();

const tabs = computed(() =>
  contact.value
    ? [
        {
          id: 'adminContactsViewOverview',
          label: t('contactOverview.overview'),
          to: `/admin/contacts/${contact.value.id}`,
        },
        {
          id: 'adminContactsViewInformation',
          label: t('contactOverview.information'),
          to: `/admin/contacts/${contact.value.id}/information`,
        },
        {
          id: 'contactContribution',
          label: t('contactOverview.contribution'),
          to: `/admin/contacts/${contact.value.id}/contribution`,
        },
        /*
        {
          id: 'contactRoles',
          label: t('contactOverview.roles'),
          to: `/admin/contacts/${contact.value.id}/roles`,
        },*/
      ]
    : []
);

onBeforeMount(async () => {
  contact.value = await fetchMember(props.id as string);
});
</script>
