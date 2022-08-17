<template>
  <div class="flex text-body-80">
    <FontAwesomeIcon
      class="text-base font-primary-80"
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
