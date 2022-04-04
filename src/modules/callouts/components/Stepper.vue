<template>
  <div
    v-for="(step, stepIndex) in steps"
    :key="stepIndex"
    class="flex flex-col"
  >
    <div
      :class="
        stepIndex === modelValue
          ? 'bg-primary-20'
          : 'bg-primary-5 hover:bg-primary-10 cursor-pointer'
      "
      class="p-4 my-1 rounded"
      @click="emit('update:modelValue', stepIndex)"
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
import { Step, Steps } from '../create-callout.interface';
defineProps<{ steps: Step<unknown>[]; modelValue: number }>();
const emit = defineEmits(['update:modelValue']);
</script>
