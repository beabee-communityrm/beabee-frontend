<template>
  <AppLink :to="notice.url">
    <div class="mb-2 bg-white rounded p-4.5 flex md:items-center shadow">
      <font-awesome-icon
        class="text-warning text-xl mr-2"
        :icon="['fas', 'bullhorn']"
      />

      <span class="text-sm md:text-lg">
        {{ notice.text }}
      </span>

      <div class="ml-auto hidden md:flex">
        <app-button :to="notice.url">{{ notice.buttonText }}</app-button>
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
