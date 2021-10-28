<template>
  <page-title :title="callout ? callout.title : 'Loading'" sub-title="" />
  <p>{{ callout && callout.templateSchema.formSchema }}</p>
  <form-i-o v-if="callout" :form="callout.templateSchema.formSchema" />
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import { Form as FormIO } from 'vue-formio';
import { onMounted, ref } from '@vue/runtime-core';
import axios from '../../axios';

interface Callout {
  title: string;
  template: string;
  templateSchema: {
    intro: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    formSchema: object;
  };
}

const callout = ref<Callout | undefined>();

onMounted(async () => {
  const callouts = (await axios.get('/callout')).data as Callout[];
  callout.value = callouts.find((c) => c.template === 'builder');
});
</script>
