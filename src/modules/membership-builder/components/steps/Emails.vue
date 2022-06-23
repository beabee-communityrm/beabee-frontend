<template>
  <form @submit.prevent>
    <AppHeading class="mb-5">Welcome & goodbye emails</AppHeading>
    <AppSubHeading>Welcome email</AppSubHeading>
    <AppSubHeading>Cancellation email</AppSubHeading>
  </form>
</template>

<script lang="ts" setup>
import AppHeading from '../../../../components/AppHeading.vue';
import AppSubHeading from '../../../../components/AppSubHeading.vue';
</script>
