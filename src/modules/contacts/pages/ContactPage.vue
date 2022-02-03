<template>
  <template v-if="contact">
    <div class="mb-2">
      <PageTitle
        :title="
          `${contact.firstname} ${contact.lastname}`.trim() || contact.email
        "
      ></PageTitle>
    </div>

    <AppTabs>
      <AppTabsItem :to="`/contacts/${contact.id}`">Overview</AppTabsItem>
      <AppTabsItem :to="`/contacts/${contact.id}/information`"
        >Information</AppTabsItem
      >
      <AppTabsItem :to="`/contact/${contact.id}/roles`">Roles</AppTabsItem>
      <AppTabsItem :to="`/members/${contact.id}/contribution`"
        >Contribution</AppTabsItem
      >
    </AppTabs>

    <router-view :contact="contact"></router-view>
  </template>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import PageTitle from '../../../components/PageTitle.vue';
import { GetMemberData } from '../../../utils/api/api.interface';
import { fetchMember } from '../../../utils/api/member';
import AppTabs from '../../../components/AppTabs.vue';
import AppTabsItem from '../../../components/AppTabsItem.vue';

const route = useRoute();

const contact = ref<GetMemberData | undefined>();

onBeforeMount(async () => {
  contact.value = await fetchMember(route.params.id as string);
});
</script>
