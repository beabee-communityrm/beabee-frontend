<template>
  <template v-if="contact">
    <div class="mb-2">
      <PageTitle
        :title="
          `${contact.firstname} ${contact.lastname}`.trim() || contact.email
        "
      ></PageTitle>
    </div>

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

const route = useRoute();

const { t } = useI18n();

const contact = ref<GetMemberData | undefined>();

const tabs = computed(() =>
  contact.value
    ? [
        {
          id: 'contactOverview',
          label: t('contactOverview.overview'),
          to: `/contacts/${contact.value.id}`,
        },
        {
          id: 'contactInformation',
          label: t('contactOverview.information'),
          to: `/contacts/${contact.value.id}/information`,
        },
        /*{
          id: 'contactContribution',
          label: t('contactOverview.roles'),
          to: `/contacts/${contact.value.id}/contribution`,
        }{
          id: 'contactRoles',
          label: t('contactOverview.roles'),
          to: `/contacts/${contact.value.id}/roles`,
        },*/
      ]
    : []
);

onBeforeMount(async () => {
  contact.value = await fetchMember(route.params.id as string);
});
</script>
