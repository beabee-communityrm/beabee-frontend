<template><div /></template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { completeSignUp } from '../../../../utils/api/signup';

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
  completeSignUp(route.query.redirect_flow_id as string)
    .then(() => {
      router.replace('/join/confirm-email');
    })
    .catch(() => {
      router.replace('/join/failed');
    });
});
</script>
