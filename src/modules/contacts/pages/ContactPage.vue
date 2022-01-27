<template>
  <template v-if="contact">
    <PageTitle :title="`${contact.firstname} ${contact.lastname}`"></PageTitle>
  </template>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import PageTitle from '../../../components/PageTitle.vue';
import { GetMemberData } from '../../../utils/api/api.interface';
import { fetchMember } from '../../../utils/api/member';

const route = useRoute();

const contact = ref<GetMemberData | undefined>();

onBeforeMount(async () => {
  contact.value = await fetchMember(route.params.id as string);
});
</script>
