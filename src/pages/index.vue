<route lang="yaml">
meta:
  pageTitle: menu.home
</route>
<template><div /></template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { canAdmin } from '../utils/user';
useRouter().replace(canAdmin.value ? '/admin' : '/profile');
</script>
