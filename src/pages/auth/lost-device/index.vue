<!--
  Same as the lost-device/[email] page, but without the email in the URL.
-->

<route lang="yaml">
name: lost-device-without-email
meta:
  layout: Auth
  pageTitle: pageTitle.lostDevice
  noAuth: true
</route>

<template>
  <LostDevicePage :email="email" />
</template>

<script lang="ts" setup>
import LostDevicePage from './[email].vue';
withDefaults(
  defineProps<{
    email: string;
  }>(),
  {
    email: '',
  }
);
</script>
