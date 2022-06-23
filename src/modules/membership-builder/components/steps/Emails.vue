<template>
  <form @submit.prevent>
    <AppHeading class="mb-5">Welcome & goodbye emails</AppHeading>
    <div class="flex mb-8">
      <div class="flex-1">
        <AppSubHeading class="mb-4">Welcome email</AppSubHeading>
        <AppInput label="Subject" class="mb-4" />
        <RichTextEditor label="Message" />
      </div>
      <div class="flex-1"></div>
    </div>

    <div class="flex">
      <div class="flex-1">
        <AppSubHeading class="mb-4">Cancellation email</AppSubHeading>
        <AppInput label="Subject" class="mb-4" />
        <RichTextEditor label="Message" />
      </div>
      <div class="flex-1"></div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import AppHeading from '../../../../components/AppHeading.vue';
import AppSubHeading from '../../../../components/AppSubHeading.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
</script>
