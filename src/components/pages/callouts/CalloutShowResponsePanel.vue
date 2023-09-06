<template>
  <CalloutSidePanel :show="!!response" @close="$emit('close')">
    <div v-if="response">
      <h2 class="text-2xl font-bold font-title mb-4">{{ response.title }}</h2>
      <div
        v-if="response.photos.length > 0"
        class="relative overflow-hidden mb-4 -mx-4"
      >
        <ul
          class="flex items-center transition-transform"
          :style="{ transform: `translateX(${currentPhotoIndex * -100}%)` }"
        >
          <li
            v-for="photo in response.photos"
            :key="photo.url"
            class="w-full flex-none p-4"
          >
            <img class="w-full" :src="photo.url + '?w=600&h=600'" />
          </li>
        </ul>
        <div
          v-if="response.photos.length > 1"
          class="absolute top-1/2 inset-x-0 flex justify-between text-2xl font-bold transform -translate-y-1/2"
        >
          <div>
            <button
              v-show="currentPhotoIndex > 0"
              class="bg-primary text-white w-10 h-10 rounded-full"
              @click="currentPhotoIndex--"
            >
              <font-awesome-icon :icon="faChevronLeft" />
            </button>
          </div>
          <div>
            <button
              v-show="currentPhotoIndex < response.photos.length - 1"
              class="bg-primary text-white w-10 h-10 rounded-full"
              @click="currentPhotoIndex++"
            >
              <font-awesome-icon :icon="faChevronRight" />
            </button>
          </div>
        </div>
      </div>
      <Form
        :key="response.number"
        class="callout-form-simple"
        :form="callout.formSchema"
        :submission="{ data: response.answers }"
        :options="{ readOnly: true, noAlerts: true, renderMode: 'html' }"
      />
    </div>
  </CalloutSidePanel>
</template>

<script lang="ts" setup>
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { ref, watch } from 'vue';
import {
  GetCalloutDataWith,
  GetCalloutResponseMapData,
} from '../../../utils/api/api.interface';
import { Form } from '../../../lib/formio';
import CalloutSidePanel from './CalloutSidePanel.vue';

defineEmits<(e: 'close') => void>();
const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
  response?: GetCalloutResponseMapData;
}>();

const currentPhotoIndex = ref(0);

watch(
  () => props.response,
  () => {
    currentPhotoIndex.value = 0;
  }
);
</script>

<style lang="postcss">
.callout-form-simple {
  .form-group {
    @apply mb-1;
  }

  .formio-component-file {
    @apply hidden;
  }

  .col-form-label {
    @apply inline-flex font-bold font-title;
    &::after {
      @apply text-body;
      content: ': ';
    }
  }

  div[ref='element'],
  div[ref='value'] {
    @apply inline;
  }
}
</style>
