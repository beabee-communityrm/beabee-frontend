<template>
  <router-link to="/">
    <img
      :src="generalContent.logoUrl || defaultLogo"
      :alt="generalContent.organisationName"
    />
  </router-link>
</template>
<script lang="ts" setup>
import { canAdmin, generalContent } from '../store';
import defaultLogo from '../assets/images/logo.png';
</script>
