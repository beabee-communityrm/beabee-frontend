<template>
  <div class="flex text-body-80">
    <FontAwesomeIcon
      class="font-primary-80 text-base"
      :icon="['fas', 'info-circle']"
    />

    <span class="ml-1 text-xs font-semibold">{{ message }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
});
</script>
