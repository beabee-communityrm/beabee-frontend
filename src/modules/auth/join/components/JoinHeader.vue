<template>
  <header class="flex mb-4">
    <img
      src="../../../../assets/images/logo.png"
      :alt="generalContent.organisationName"
      class="w-16 flex-none self-start"
    />
    <div class="self-center flex flex-col ml-4">
      <h1 class="font-semibold text-2xl">
        {{ title }}
      </h1>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { generalContent } from '../../../../store';

defineProps<{ title: string }>();
</script>
