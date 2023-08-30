<template>
  <div class="mt-5 grid grid-cols-2 items-end gap-6">
    <div class="col-span-1">
      <slot />
    </div>
    <div class="col-span-1 text-sm text-grey content-i18n" v-html="help" />
  </div>
</template>
<script lang="ts" setup>
defineProps<{ help?: string }>();
</script>
