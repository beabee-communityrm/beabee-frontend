<template>
  <div v-for="step in steps" class="flex flex-col">
    <div class="p-3 mt-2 mb-2 border-2">
      <h4 class="font-semibold">{{ step.name }}</h4>
      <p>{{ step.description }}</p>
      <p>{{ step.validated === true ? '✅' : '❌' }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Steps } from '../pages/CreateCallout.vue';
defineProps<{ steps: Steps }>();
</script>
