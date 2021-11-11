<template>
  <header>
    <div class="flex mb-4">
      <img
        src="../../../../assets/images/logo.png"
        :alt="newsroomName"
        class="w-16 flex-none self-start"
      />
      <div class="flex flex-col ml-4">
        <h1 class="font-semibold text-2xl">
          {{ title }}
        </h1>
        <p v-if="subTitle" class="mt-2">
          {{ subTitle }}
        </p>
      </div>
    </div>

    <h2 v-if="description">
      {{ description }}
    </h2>
  </header>
</template>

<script lang="ts" setup>
const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;

defineProps({
  title: {
    type: String,
    default: '',
  },
  subTitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});
</script>
