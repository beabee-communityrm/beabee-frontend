<template>
  <div v-for="step in steps" :key="step.id" class="flex flex-col">
    <div
      :class="
        step.id === selectedStep.id
          ? 'bg-primary-20'
          : 'bg-primary-5 hover:bg-primary-10'
      "
      class="p-4 mt-2 mb-2"
      @click="emit('update:selectedStep', step)"
    >
      <h4 class="font-semibold">
        {{ step.validated === true ? '✅' : '❌' }} {{ step.name }}
      </h4>
      <p class="text-sm text-grey mt-1">{{ step.description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Step, Steps } from '../pages/CreateCallout.vue';
defineProps<{ steps: Steps; selectedStep: Step }>();
const emit = defineEmits(['update:selectedStep']);
</script>
