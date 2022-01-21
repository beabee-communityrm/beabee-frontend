<template><div /></template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { completeStartContribution } from '../../../utils/api/member';

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  completeStartContribution(route.query.redirect_flow_id as string)
    .then(() => {
      router.replace({
        path: '/profile/contribution',
        query: { startedContribution: null },
      });
    })
    .catch((err) => err);
});
</script>
