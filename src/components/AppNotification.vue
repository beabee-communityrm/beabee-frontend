<template>
  <div class="bg-white text-sm text-body-80">
    <div class="border-t-8 border-t-[currentColor]" :class="colorClass" />
    <div class="p-4">
      <div class="mb-2 flex items-center gap-4">
        <span class="flex-1 font-bold" :class="colorClass">
          {{ title }}
        </span>
        <template v-if="removeable">
          <svg
            class="h-5 w-5 -rotate-90"
            :class="colorClass"
            viewBox="0 0 24 24"
          >
            <circle
              class="fill-none stroke-[currentColor] stroke-[4] transition-[stroke-dasharray]"
              :r="circleRadius"
              cx="12"
              cy="12"
              :style="circleStyle"
            />
          </svg>
          <a
            class="inline-block cursor-pointer px-2 py-1 hover:bg-grey-lighter hover:text-body"
            @click="emit('remove')"
          >
            <font-awesome-icon :icon="['fa', 'times']" />
          </a>
        </template>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const emit = defineEmits(['remove']);
const props = defineProps<{
  variant: 'success' | 'warning' | 'error';
  title: string;
  removeable?: 'auto' | true;
}>();

const circleRadius = 10;
const circleSize = Math.PI * circleRadius * 2;
const circleProgress = ref<number>(0);

if (props.removeable === 'auto') {
  circleProgress.value = 0.2;
  const interval = window.setInterval(() => {
    circleProgress.value = circleProgress.value + 0.2;
    if (circleProgress.value > 1) {
      window.clearInterval(interval);
      emit('remove');
    }
  }, 1000);
}

const circleStyle = computed(() => ({
  'stroke-dasharray': `${circleSize * circleProgress.value} ${circleSize}`,
}));

const colorClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    default:
      return 'text-danger';
  }
});
</script>
<style scoped></style>
