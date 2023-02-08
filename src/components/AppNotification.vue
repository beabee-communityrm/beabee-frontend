<template>
  <div class="bg-white text-sm text-body-80">
    <div class="border-t-8 border-t-[currentColor]" :class="colorClass" />
    <div class="p-4">
      <div class="mb-2 flex items-center gap-4">
        <span class="flex-1 font-bold" :class="colorClass">
          {{ title }}
        </span>
        <svg class="h-5 w-5 -rotate-90" :class="colorClass" viewBox="0 0 24 24">
          <circle
            class="fill-none stroke-[currentColor] stroke-[4] transition-[stroke-dasharray]"
            :r="circleRadius"
            cx="12"
            cy="12"
            :style="{
              'stroke-dasharray': `${
                done * circleCircumference
              } ${circleCircumference}`,
            }"
          />
        </svg>
        <font-awesome-icon :icon="['fa', 'times']" @click="emit('remove')" />
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
}>();

const circleRadius = 10;
const circleCircumference = Math.PI * circleRadius * 2;

const done = ref(0);
setInterval(() => {
  done.value = done.value === 1 ? 0 : done.value + 0.2;
}, 1000);

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
