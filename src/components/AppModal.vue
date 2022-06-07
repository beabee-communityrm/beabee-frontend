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
      bg-gray-700 bg-opacity-50
    "
  >
    <div class="max-w-sm p-6 bg-white divide-y divide-gray-500">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl"><slot name="title" /></h3>
      </div>

      <div>
        <FontAwesomeIcon
          class="text-xl cursor-pointer"
          :icon="['fas', 'times']"
          @click="$emit('close')"
        />
      </div>

      <div class="mt-4">
        <p class="mb-4 text-sm"><slot name="text" /></p>
        <button class="px-4 py-2 rounded" @click="$emit('confirm')">
          <slot name="button-text" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { useSlots } from '@vue/runtime-core';

const slots = useSlots();
</script>
