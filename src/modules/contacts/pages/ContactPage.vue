<template>
  <template v-if="contact">
    <div class="mb-2">
      <PageTitle
        :title="`${contact.firstname} ${contact.lastname}`"
      ></PageTitle>
    </div>

    <div class="flex border-primary-40 border-b mb-4">
      <AppTab :to="`/contacts/${contact.id}`">Overview</AppTab>
      <AppTab :to="`/contacts/${contact.id}/information`">Information</AppTab>
      <AppTab :to="`/contact/${contact.id}/roles`">Roles</AppTab>
    </div>

    <router-view :contact="contact"></router-view>
  </template>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import PageTitle from '../../../components/PageTitle.vue';
import { GetMemberData } from '../../../utils/api/api.interface';
import AppTab from '../../../components/AppTab.vue';
import { fetchMember } from '../../../utils/api/member';

const route = useRoute();

const contact = ref<GetMemberData | undefined>();

onBeforeMount(async () => {
  contact.value = await fetchMember(route.params.id as string);
});
</script>
