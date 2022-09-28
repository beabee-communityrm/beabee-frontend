<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4 h-full"
      :class="{ hidden: !open }"
      @click="$emit('close')"
    >
      <div
        ref="divRef"
        class="relative rounded bg-white p-6 md:p-8 shadow-lg max-w-md max-h-full flex flex-col"
        v-bind="$attrs"
        @click.stop
      >
        <button
          class="absolute top-0 right-0 w-8 h-8 hover:text-primary"
          type="button"
          @click="$emit('close')"
        >
          <font-awesome-icon :icon="['fa', 'times']" />
        </button>
        <AppHeading v-if="title" class="mb-4">{{ title }}</AppHeading>
        <div class="overflow-auto">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref, toRef, watch } from 'vue';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import AppHeading from './AppHeading.vue';

defineEmits(['close']);
const props = defineProps<{
  open: boolean;
  title?: string;
}>();

const divRef = ref<HTMLElement>();

watch([toRef(props, 'open'), divRef], ([open]) => {
  if (divRef.value) {
    if (open) {
      disableBodyScroll(divRef.value);
    } else {
      enableBodyScroll(divRef.value);
    }
  }
});

onBeforeUnmount(() => {
  if (divRef.value && props.open) {
    enableBodyScroll(divRef.value);
  }
});
</script>
