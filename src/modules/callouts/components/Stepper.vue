<template>
  <div v-for="(step, stepIndex) in steps" :key="step.id" class="flex flex-col">
    <div
      :class="
        stepIndex === selectedStepIndex
          ? 'bg-primary-20'
          : 'bg-primary-5 hover:bg-primary-10 cursor-pointer'
      "
      class="p-4 mt-2 mb-2 rounded"
      @click="emit('update:selectedStepIndex', stepIndex)"
    >
      <h4 class="flex items-center font-semibold">
        <AppRoundBadge
          :type="step.validated === true ? 'success' : 'warning'"
          size="large"
          class="mr-2"
        />
        {{ step.name }}
      </h4>
      <p class="text-sm text-grey mt-1">{{ step.description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppRoundBadge from '../../../components/AppRoundBadge.vue';
import { Steps } from '../create-callout.interface';
defineProps<{ steps: Steps; selectedStepIndex: number }>();
const emit = defineEmits(['update:selectedStepIndex']);
</script>
