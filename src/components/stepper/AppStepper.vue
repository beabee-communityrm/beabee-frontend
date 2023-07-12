<template>
  <ul class="mb-4 flex gap-4">
    <li
      v-for="(step, stepIndex) in steps"
      :key="stepIndex"
      class="flex flex-col"
    >
      <div
        :class="
          stepIndex === modelValue
            ? 'bg-white'
            : 'cursor-pointer bg-primary-5 hover:bg-primary-10'
        "
        class="my-1 rounded p-4"
        @click="emit('update:modelValue', stepIndex)"
      >
        <h4
          class="flex items-center font-semibold"
          :class="
            step.error
              ? 'text-danger'
              : stepIndex === modelValue
              ? 'text-link'
              : ''
          "
        >
          <span
            class="mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle"
            :class="{
              'bg-link': step.validated,
              'border-link': step.validated || stepIndex === modelValue,
              'border-danger': step.error,
            }"
          />
          {{ step.name }}
        </h4>
        <p class="mt-1 text-sm text-grey">{{ step.description }}</p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { Step } from './stepper.interface';
defineProps<{ steps: Step[]; modelValue: number }>();
const emit = defineEmits(['update:modelValue']);
</script>
