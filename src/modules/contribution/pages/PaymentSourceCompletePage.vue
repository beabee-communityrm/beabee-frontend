<template><div /></template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { completeUpdatePaymentMethod } from '../../../utils/api/member';

const route = useRoute();
const router = useRouter();

onBeforeMount(async () => {
  const paymentFlowId = (
    route.query.redirect_flow_id || route.query.setup_intent
  )?.toString();

  if (paymentFlowId) {
    try {
      await completeUpdatePaymentMethod(paymentFlowId);
      router.replace({
        path: '/profile/contribution',
        query: { updatedPaymentSource: null },
      });
      return;
    } catch (err) {}
  }

  router.replace('/profile/contribution');
});
</script>
