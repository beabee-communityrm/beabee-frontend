<template>
  <div v-for="(step, stepIndex) in steps" :key="step.id" class="flex flex-col">
    <div
      :class="
        stepIndex === selectedStepIndex
          ? 'bg-primary-20'
          : 'bg-primary-5 hover:bg-primary-10'
      "
      class="p-4 mt-2 mb-2"
      @click="emit('update:selectedStepIndex', stepIndex)"
    >
      <h4 class="font-semibold">
        <!-- {{ step.validated === true ? '✅' : '❌' }} {{ step.name }} -->
        <AppRoundBadge
          :type="step.validated === true ? 'success' : 'warning'"
          size="large"
          class="mr-1"
        />
        {{ step.name }}
      </h4>
      <p class="text-sm text-grey mt-1">{{ step.description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Step, Steps } from '../pages/CreateCallout.vue';
import AppRoundBadge from '../../../components/AppRoundBadge.vue';
defineProps<{ steps: Steps; selectedStepIndex: number }>();
const emit = defineEmits(['update:selectedStepIndex']);
</script>
