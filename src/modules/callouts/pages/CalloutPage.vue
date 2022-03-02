<template>
  <div v-if="callout">
    <div class="mb-5">
      <PageTitle :title="callout.title" />
    </div>
    <div class="md:max-w-xl">
      <div>
        <div class="relative mb-4 pb-[56.25%]">
          <img
            class="absolute w-full h-full object-cover"
            :src="callout.image"
          />
        </div>
        <div
          class="mb-4 text-lg pb-4 border-primary-40 border-b"
          v-html="callout.templateSchema.intro"
        />
        <div class="callout-form">
          <Form :form="callout.templateSchema.formSchema" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { Form } from 'vue-formio';
import { useRoute } from 'vue-router';
import { GetMoreCalloutData } from '../../../utils/api/api.interface';
import { fetchCallout } from '../../../utils/api/callout';
import PageTitle from '../../../components/PageTitle.vue';

const route = useRoute();

const callout = ref<GetMoreCalloutData>();

onBeforeMount(async () => {
  callout.value = await fetchCallout(route.params.id as string);
});
</script>
