<template>
  <AppLink :to="notice.url">
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
        <AppButton :to="notice.url">{{ notice.buttonText }}</AppButton>
      </div>
    </div>
  </AppLink>
</template>

<script lang="ts" setup>
import AppButton from '../../components/forms/AppButton.vue';
import AppLink from '../../components/AppLink.vue';
import { Notice } from './notice.interface';

defineProps({
  notice: {
    default: () => ({}),
    type: Object as () => Notice,
  },
});
</script>
