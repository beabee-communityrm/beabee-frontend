<template>
  <a :href="canAdmin ? '/admin' : '/profile'">
    <img
      :src="generalContent.logoUrl || defaultLogo"
      :alt="generalContent.organisationName"
    />
  </a>
</template>
<script lang="ts" setup>
import { canAdmin, generalContent } from '../store';
import defaultLogo from '../assets/images/logo.png';
</script>
