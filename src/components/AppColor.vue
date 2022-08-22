<template>
  <div>
    <span
      class="w-10 h-10 rounded-full mb-1 mr-1 inline-block align-middle"
      :class="name"
    />
    {{ shade }}
  </div>
</template>
<script lang="ts" setup>
defineProps({
  name: {
    required: true,
    type: String,
  },
  shade: {
    required: true,
    type: String,
  },
});
</script>
