<template>
  <ul class="flex mb-8 gap-4">
    <li
      v-for="(step, stepIndex) in steps"
      :key="stepIndex"
      class="relative group flex-1 max-w-[200px] my-1 rounded p-4 text-center"
      :class="[
        stepIndex === modelValue
          ? 'bg-white text-link'
          : 'cursor-pointer text-primary-60 bg-primary-5',
        step.error ? '!text-danger' : '',
      ]"
      @click="emit('update:modelValue', stepIndex)"
    >
      <span
        class="absolute mt-2 -inset-x-2 border-t-2 border-grey group-first:left-1/2 group-last:right-1/2"
      />
      <span
        class="relative mr-2 mt-px inline-block h-4 w-4 rounded-full border-2"
        :class="
          step.validated
            ? 'bg-link border-link'
            : stepIndex === modelValue
            ? 'bg-white border-link'
            : 'bg-primary-5 border-grey'
        "
      />
      <h4 class="font-semibold">{{ step.name }}</h4>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { Step } from './stepper.interface';
defineProps<{ steps: Step[]; modelValue: number }>();
const emit = defineEmits(['update:modelValue']);
</script>
