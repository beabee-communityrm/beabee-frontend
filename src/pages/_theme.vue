<route lang="yaml">
name: theme
meta:
  noAuth: true
  pageTitle: Theme settings
</route>
<template>
  <h2 class="mb-2 font-title text-2xl">Colours</h2>
  <div class="flex bg-white p-4">
    <div class="flex-1">
      <AppColor name="bg-primary" shade="Primary" />
      <AppColor name="bg-primary-5" shade="5" />
      <AppColor name="bg-primary-10" shade="10" />
      <AppColor name="bg-primary-20" shade="20" />
      <AppColor name="bg-primary-40" shade="40" />
      <AppColor name="bg-primary-70" shade="70" />
      <AppColor name="bg-primary-80" shade="80" />
    </div>
    <div class="flex-1">
      <AppColor name="bg-body" shade="Body" />
      <AppColor name="bg-body-40" shade="40" />
      <AppColor name="bg-body-80" shade="80" />
    </div>
    <div class="flex-1">
      <AppColor name="bg-link" shade="Link" />
      <AppColor name="bg-link-10" shade="10" />
      <AppColor name="bg-link-30" shade="30" />
      <AppColor name="bg-link-70" shade="70" />
      <AppColor name="bg-link-110" shade="110" />
    </div>
    <div class="flex-1">
      <AppColor name="bg-warning" shade="Warning" />
      <AppColor name="bg-warning-10" shade="10" />
      <AppColor name="bg-warning-30" shade="30" />
      <AppColor name="bg-warning-70" shade="70" />
    </div>
    <div class="flex-1">
      <AppColor name="bg-success" shade="Success" />
      <AppColor name="bg-success-10" shade="10" />
      <AppColor name="bg-success-30" shade="30" />
      <AppColor name="bg-success-70" shade="70" />
      <AppColor name="bg-success-110" shade="110" />
    </div>
    <div class="flex-1">
      <AppColor name="bg-danger" shade="Danger" />
      <AppColor name="bg-danger-10" shade="10" />
      <AppColor name="bg-danger-30" shade="30" />
      <AppColor name="bg-danger-70" shade="70" />
      <AppColor name="bg-danger-110" shade="110" />
    </div>
    <div class="flex-1">
      <AppColor name="bg-grey" shade="Grey" />
      <AppColor name="bg-grey-lighter" shade="Lighter" />
      <AppColor name="bg-grey-light" shade="Light" />
      <AppColor name="bg-grey-dark" shade="Dark" />
      <AppColor name="bg-grey-darker" shade="Darker" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppColor from '../components/AppColor.vue';
</script>
