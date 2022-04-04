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
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { GetBasicCalloutData } from '../utils/api/api.interface';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const props = defineProps<{
  callout: GetBasicCalloutData;
}>();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
