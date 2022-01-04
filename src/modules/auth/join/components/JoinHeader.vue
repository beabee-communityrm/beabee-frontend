<template>
  <header>
    <div class="flex mb-4">
      <img
        src="../../../../assets/images/logo.png"
        :alt="newsroomName"
        class="w-16 flex-none self-start"
      />
      <div class="flex flex-col ml-4">
        <h1 class="font-title font-semibold text-2xl">
          {{ title }}
        </h1>
        <p v-if="subTitle" class="mt-2">
          {{ subTitle }}
        </p>
      </div>
    </div>

    <div class="content-message" v-html="description" />
  </header>
</template>

<script lang="ts" setup>
const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;

defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
});
</script>
