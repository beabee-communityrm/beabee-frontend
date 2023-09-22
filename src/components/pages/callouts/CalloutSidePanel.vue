<template>
  <transition name="side-panel">
    <aside
      v-if="show"
      class="fixed z-20 left-0 inset-y-0 bg-white p-8 w-full max-w-lg overflow-scroll shadow-lg"
    >
      <button
        class="absolute right-2 top-2 h-10 w-10 hover:text-primary text-2xl"
        type="button"
        @click="$emit('close')"
      >
        <font-awesome-icon :icon="faTimes" />
      </button>
      <slot />
    </aside>
  </transition>
</template>
<script lang="ts" setup>
import { faTimes } from '@fortawesome/free-solid-svg-icons';

defineEmits<{ (e: 'close'): void }>();
defineProps<{ show: boolean }>();
</script>

<style lang="postcss" scoped>
.side-panel-enter-active,
.side-panel-leave-active {
  @apply transition-transform;
}

.side-panel-enter-from,
.side-panel-leave-to {
  @apply transform -translate-x-full;
}

.side-panel-enter-to,
.side-panel-leave-from {
  @apply transform translate-x-0;
}
</style>
