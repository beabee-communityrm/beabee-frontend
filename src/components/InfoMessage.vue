<template>
  <div class="flex text-body-80">
    <FontAwesomeIcon class="text-xl -mt-0.5" :icon="['fas', 'info-circle']" />

    <span class="ml-1 text-xs">{{ message }}</span>
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
