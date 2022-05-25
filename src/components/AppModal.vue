<template>
  <Teleport to="body">
    <div
      class="
        fixed
        inset-0
        z-50
        bg-black bg-opacity-20
        flex
        justify-center
        items-center
        p-4
      "
      v-bind="$attrs"
      @click="$emit('close')"
    >
      <div class="rounded bg-white p-8">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
defineEmits(['close']);
</script>
