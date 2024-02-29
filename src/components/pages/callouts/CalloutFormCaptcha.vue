<template>
  <CaptchaFox :sitekey="env.captchafoxKey" />
</template>
<script setup lang="ts">
import { CaptchaFox } from '@captchafox/vue';
import env from '@env';
</script>
