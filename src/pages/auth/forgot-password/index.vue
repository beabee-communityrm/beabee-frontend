<!--
  Same as the forgot-password/[email] page, but without the email in the URL.
-->

<route lang="yaml">
name: forgot-password-with-email
meta:
  layout: Auth
  pageTitle: pageTitle.forgotPassword
  noAuth: true
</route>

<template>
  <ForgotPasswordPage :email="email" />
</template>

<script lang="ts" setup>
import ForgotPasswordPage from './[email].vue';
withDefaults(
  defineProps<{
    email: string;
  }>(),
  {
    email: '',
  }
);
</script>
