<template>
  <div class="sticky top-4">
    <div
      v-for="(step, stepIndex) in steps"
      :key="stepIndex"
      class="flex flex-col"
    >
      <div
        :class="
          stepIndex === modelValue
            ? 'bg-white'
            : 'bg-primary-5 hover:bg-primary-10 cursor-pointer'
        "
        class="p-4 my-1 rounded"
        @click="emit('update:modelValue', stepIndex)"
      >
        <h4
          class="flex items-center font-semibold"
          :class="{ 'text-link': stepIndex === modelValue }"
        >
          <span
            class="inline-block w-4 h-4 border-2 rounded-full align-middle mr-2"
            :class="{
              'bg-link': step.validated,
              'border-link': step.validated || stepIndex === modelValue,
            }"
          />
          {{ step.name }}
        </h4>
        <p class="text-sm text-grey mt-1">{{ step.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Step } from './stepper.interface';
defineProps<{ steps: Step[]; modelValue: number }>();
const emit = defineEmits(['update:modelValue']);
</script>
