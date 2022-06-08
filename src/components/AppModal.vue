<template>
  <!--
  <div
    class="flex items-center px-4 text-white font-semibold rounded"
  >
    <div v-if="slots.icon" class="mr-4 text-lg">
      <slot name="icon" />
    </div>

    <div class="py-4"><slot /></div>
  </div>
  -->

  <div
    class="
      absolute
      inset-0
      flex
      items-center
      justify-center
      bg-black bg-opacity-50
    "
  >
    <div class="max-w-md relative bg-white rounded">
      <div class="absolute top-0 right-0 p-3 text-primary-80 hover:text-primary">
        <FontAwesomeIcon
          class="text-xl cursor-pointer"
          :icon="['fas', 'times']"
          @click="$emit('close')"
        />
      </div>

      <article class="p-8">
        <header class="flex items-center justify-between mb-4">
          <h3 class="text-2xl font-semibold text-danger"><slot name="title" /></h3>
        </header>

        <div class="py-2">
          <p class="mb-4 text-lg"><slot name="text" /></p>
        </div>

        <footer class="text-center">
          <AppButton
            class="mr-4"
            variant="primaryOutlined"
            @click="$emit('close')"
            ><slot name="button-cancel-text"
          /></AppButton>
          <AppButton
            to="/admin/callouts"
            variant="danger"
            @click="$emit('confirm')"
            ><slot name="button-confirm-text"
          /></AppButton>
        </footer>
      </article>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { useSlots } from '@vue/runtime-core';
import AppButton from '../components/forms/AppButton.vue';

const slots = useSlots();
</script>
