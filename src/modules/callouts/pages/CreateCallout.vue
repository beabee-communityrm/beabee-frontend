<template>
  <h4>Create a new callout</h4>
  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-1">
      <Stepper :steps="steps" v-model:selectedStep="selectedStep" />
    </div>
    <div class="col-span-2">
      <component
        :is="selectedStep.component"
        v-model:data="selectedStep.data"
        v-model:validated="selectedStep.validated"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import Stepper from '../components/Stepper.vue';
import TitleAndImage from '../components/TitleAndImage.vue';
import Visibility from '../components/Visibility.vue';

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
  {
    id: 'second',
    name: 'Visibility settings',
    description: 'Specify callout visibility and other details',
    validated: false,
    component: Visibility,
    data: { foo: '' },
  },
]);

const selectedStep = ref(steps[0]);
</script>
