<template><div /></template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { completeSignUp } from '../../../../utils/api/signup';

const route = useRoute();
const router = useRouter();

onBeforeMount(async () => {
  const paymentFlowId = (
    route.query.redirect_flow_id || route.query.setup_intent
  )?.toString();

  if (paymentFlowId) {
    try {
      await completeSignUp(paymentFlowId);
      router.replace('/join/confirm-email');
      return;
    } catch (err) {}
  }

  router.replace('/join/failed');
});
</script>
