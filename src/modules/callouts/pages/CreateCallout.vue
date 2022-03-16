<template>
  <h4>Create a new callout</h4>
  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-1">
      <Stepper :steps="steps" />
    </div>
    <div class="col-span-2">
      <CreateTitle :calloutTitle="model.title" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Stepper from '../components/Stepper.vue';
import CreateTitle from '../components/CreateTitle.vue';

export type Step = {
  id: string;
  name: string;
  description: string;
  validated: boolean;
};
export type Steps = Array<Step>;

type Callout = {
  title: string;
  url: string;
};

const model: Callout = {
  title: '',
  url: '',
};

const hasTitle = (obj: Callout): boolean => obj.title.length > 0;
const hasURL = (obj: Callout): boolean => obj.url.length > 0;

const steps: Steps = [
  {
    id: 'first',
    name: 'Callout title',
    description: 'Set a title',
    validated: hasTitle(model),
  },
  {
    id: 'second',
    name: 'Callout URL',
    description: 'Set a URL',
    validated: hasURL(model),
  },
];
</script>
