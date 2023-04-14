<template>
  <aside
    class="border-t-8 bg-white p-4 text-sm text-body-80"
    :class="colorClass[0]"
  >
    <header class="mb-2 flex items-start gap-4">
      <span class="flex-1 font-bold" :class="colorClass[1]">
        {{ title }}
      </span>
      <template v-if="removeable !== undefined">
        <svg
          class="h-5 w-5 -rotate-90"
          :class="colorClass[2]"
          viewBox="0 0 24 24"
        >
          <circle
            class="fill-none stroke-[4] transition-[stroke-dasharray]"
            :r="circleRadius"
            cx="12"
            cy="12"
            :style="circleStyle"
          />
        </svg>
        <a
          class="inline-block w-5 cursor-pointer text-center leading-5 hover:bg-grey-lighter hover:text-body"
          @click="emit('remove')"
        >
          <font-awesome-icon :icon="faTimes" />
        </a>
      </template>
    </header>

    <slot></slot>
  </aside>
</template>

<script lang="ts" setup>
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { computed, ref } from 'vue';

const emit = defineEmits(['remove']);
const props = defineProps<{
  variant: 'success' | 'warning' | 'error';
  title: string;
  removeable?: 'auto' | '' | true;
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
      return ['border-t-success', 'text-success', 'stroke-success'];
    case 'warning':
      return ['border-t-warning', '', 'stroke-warning'];
    default:
      return ['border-t-danger', 'text-danger', 'stroke-danger'];
  }
});
</script>
<style scoped></style>
