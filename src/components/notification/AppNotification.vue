<template>
  <div class="flex py-4 pl-4 pr-3.5 text-white rounded" :class="bgColorClass">
    <div>
      <FontAwesomeIcon class="text-lg mt-1.5" :icon="['fas', icon]" />
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
      <FontAwesomeIcon
        class="text-xl cursor-pointer"
        :icon="['fas', 'times']"
        @click="removeItem"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { Notification, NotificationType } from './notification.interface';

const props = defineProps({
  notification: {
    type: Object as () => Notification,
    default: () => ({}),
  },
});

const icon = computed(() => {
  return props.notification.type === NotificationType.Success
    ? 'magic'
    : 'bomb';
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
