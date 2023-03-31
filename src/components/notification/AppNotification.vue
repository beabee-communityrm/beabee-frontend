<template>
  <div class="flex rounded py-4 pl-4 pr-3.5 text-white" :class="bgColorClass">
    <div>
      <font-awesome-icon class="mt-1.5 text-lg" :icon="icon" />
    </div>

    <div class="ml-4 flex-grow pr-3">
      <div class="text-lg font-semibold" v-html="notification.title" />

      <div
        v-if="notification.text"
        class="mt-1 leading-tight"
        v-html="notification.text"
      />
    </div>

    <div>
      <font-awesome-icon
        class="cursor-pointer text-xl"
        :icon="faTimes"
        @click="removeItem"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faBomb, faMagic, faTimes } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { Notification, NotificationType } from './notification.interface';

const props = defineProps({
  notification: {
    type: Object as () => Notification,
    default: () => ({}),
  },
});

const icon = computed(() => {
  return props.notification.type === NotificationType.Success
    ? faMagic
    : faBomb;
});

const bgColorClass = computed(() => {
  return `bg-${props.notification.type}`;
});

const emit = defineEmits(['remove']);

const removeItem = () => {
  emit('remove', props.notification.id);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const destroy = (() => {
  setTimeout(removeItem, props.notification.duration);
})();
</script>
