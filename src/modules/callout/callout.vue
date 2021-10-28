<template>
  <PageTitle :title="callout ? callout.title : 'Loading'" sub-title="" />
  <FormIO v-if="callout" :form="callout.templateSchema.formSchema" />
</template>

<script lang="ts" setup>
import { Form as FormIO } from 'vue-formio';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

import PageTitle from '../../components/PageTitle.vue';

import { fetchCallout } from './callout.service';
import { Callout } from './callout.interface';

const callout = ref<Callout | undefined>();
onMounted(async () => {
  const route = useRoute();
  callout.value = await fetchCallout(route.params.slug as string);
});
</script>
