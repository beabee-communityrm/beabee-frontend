<template>
  <div>
    <div class="flex mb-4">
      <div class="flex-1">
        <h3 class="font-semibold text-lg">{{ callout.title }}</h3>
        <p>{{ callout.excerpt }}</p>
      </div>
      <div class="flex-0 ml-4">
        <img class="w-[150px]" :src="callout.image" />
      </div>
    </div>
    <p>
      <router-link :to="calloutLink">
        <font-awesome-icon icon="external-link-alt" />
        <span class="text-link ml-2">{{ baseUrl }}{{ calloutLink }}</span>
      </router-link>
    </p>

    <div class="flex flex-row flex-1 justify-between mt-3">
      <div class="flex-col">
        <p><b>36</b> responses so far</p>
        <router-link :to="calloutResponsesLink">
          <p class="text-link text-sm">See all responses</p>
        </router-link>
      </div>
      <div class="flex flex-row flex-nowrap">
        <div class="flex-col">
          <p><b>OPEN</b> - ends in <b>5</b> days</p>
          12 Apr - 22 May 2022
        </div>
        <AppButton class="ml-2">Edit</AppButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { GetBasicCalloutData } from '../utils/api/api.interface';
import AppButton from './forms/AppButton.vue';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const props = defineProps<{
  callout: GetBasicCalloutData;
}>();

const calloutLink = computed(() => `/admin/callouts/${props.callout.slug}`);
const calloutResponsesLink = computed(() => `${calloutLink.value}/responses`);
</script>
