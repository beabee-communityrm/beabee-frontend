<template>
  <h4>Create a new callout</h4>
  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-1">
      <Stepper :steps="steps" />
    </div>
    <div class="col-span-2">
      <component
        :is="step.component"
        v-model:data="step.data"
        v-model:validated="step.validated"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
import Stepper from '../components/Stepper.vue';
import TitleAndImage from '../components/TitleAndImage.vue';

export type Step = {
  id: string;
  name: string;
  description: string;
  validated: boolean;
  component: any;
  data: {};
};
export type Steps = Array<Step>;

const steps: Steps = reactive([
  {
    id: 'first',
    name: 'Title and image',
    description: 'Set a title, description and image for the callout',
    validated: false,
    component: TitleAndImage,
    data: { title: '', description: '' },
  },
]);
const step = steps[0];
</script>
