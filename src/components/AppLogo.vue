<template>
  <img :src="generalContent.logoUrl" :alt="generalContent.organisationName" />
</template>
<script lang="ts" setup>
import { generalContent } from '../store';
</script>
