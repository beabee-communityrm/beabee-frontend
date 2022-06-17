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
      <div class="relative rounded bg-white p-8 shadow-lg" @click.stop>
        <button
          class="absolute top-0 right-0 w-8 h-8 hover:text-primary"
          type="button"
          @click="$emit('close')"
        >
          <font-awesome-icon :icon="['fa', 'times']" />
        </button>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
defineEmits(['close']);
</script>
