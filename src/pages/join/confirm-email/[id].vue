<route lang="yaml">
name: confirmEmailLoading
meta:
  layout: Loading
  noAuth: true
  pageTitle: pageTitle.confirmEmail
</route>
<template><div /></template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { updateCurrentUser } from '../../../store';
import { confirmEmail } from '../../../utils/api/signup';

const props = defineProps<{ id: string }>();

const router = useRouter();

onBeforeMount(() => {
  confirmEmail(props.id)
    .then(updateCurrentUser)
    .then(() => {
      // TODO: Cable: use old complete page
      window.location.href = '/profile/complete';
    })
    .catch((error) => {
      if (error.response?.data?.code === 'duplicate-email') {
        router.replace('/join/duplicate-email');
      } else {
        router.replace('/join/failed');
      }
    });
});
</script>
