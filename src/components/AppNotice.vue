<template>
  <a :href="notice.url">
    <div class="mb-2 bg-white rounded p-4.5 flex shadow">
      <div class="flex md:mt-1.5">
        <font-awesome-icon
          class="text-warning text-xl md:mt-1 mr-2 self-start"
          :icon="['fas', 'bullhorn']"
        />

        <div class="text-sm pr-3 md:text-lg">
          {{ notice.text }}
        </div>
      </div>

      <div class="ml-auto hidden md:flex">
        <AppButton :href="notice.url">{{ notice.buttonText }}</AppButton>
      </div>
    </div>
  </a>
</template>

<script lang="ts" setup>
import AppButton from './forms/AppButton.vue';
import { GetNoticeData } from '../utils/api/api.interface';

defineProps<{
  notice: GetNoticeData;
}>();
</script>
