<template>
  <h2 class="font-title text-2xl mb-2">Colours</h2>
  <div class="flex bg-white p-4">
    <div class="flex-1">
      <Color name="bg-primary" shade="Primary" />
      <Color name="bg-primary-5" shade="5" />
      <Color name="bg-primary-10" shade="10" />
      <Color name="bg-primary-20" shade="20" />
      <Color name="bg-primary-40" shade="40" />
      <Color name="bg-primary-70" shade="70" />
      <Color name="bg-primary-80" shade="80" />
    </div>
    <div class="flex-1">
      <Color name="bg-body" shade="Body" />
      <Color name="bg-body-40" shade="40" />
      <Color name="bg-body-80" shade="80" />
    </div>
    <div class="flex-1">
      <Color name="bg-link" shade="Link" />
      <Color name="bg-link-10" shade="10" />
      <Color name="bg-link-70" shade="70" />
      <Color name="bg-link-110" shade="110" />
    </div>
    <div class="flex-1">
      <Color name="bg-warning" shade="Warning" />
      <Color name="bg-warning-10" shade="10" />
      <Color name="bg-warning-30" shade="30" />
      <Color name="bg-warning-70" shade="70" />
    </div>
    <div class="flex-1">
      <Color name="bg-success" shade="Success" />
      <Color name="bg-success-10" shade="10" />
      <Color name="bg-success-30" shade="30" />
      <Color name="bg-success-70" shade="70" />
      <Color name="bg-success-110" shade="110" />
    </div>
    <div class="flex-1">
      <Color name="bg-danger" shade="Danger" />
      <Color name="bg-danger-10" shade="10" />
      <Color name="bg-danger-30" shade="30" />
      <Color name="bg-danger-70" shade="70" />
      <Color name="bg-danger-110" shade="110" />
    </div>
    <div class="flex-1">
      <Color name="bg-grey" shade="Grey" />
      <Color name="bg-grey-lighter" shade="Lighter" />
      <Color name="bg-grey-light" shade="Light" />
      <Color name="bg-grey-dark" shade="Dark" />
      <Color name="bg-grey-darker" shade="Darker" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Color from './components/Color.vue';
</script>
