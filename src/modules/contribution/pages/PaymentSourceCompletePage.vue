<template><div /></template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { completeUpdatePaymentSource } from '../../../utils/api/member';

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  completeUpdatePaymentSource(route.query.redirect_flow_id as string)
    .then(() => {
      router.replace({
        path: '/profile/contribution',
        query: { updatedPaymentSource: null },
      });
    })
    .catch((err) => err);
});
</script>
