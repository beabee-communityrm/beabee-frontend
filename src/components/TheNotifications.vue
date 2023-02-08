<template>
  <div class="fixed bottom-4 left-4 z-50 w-60">
    <div class="flex flex-col gap-4">
      <transition-group name="fade">
        <AppNotfication
          v-for="(notification, i) in notifications"
          :key="i"
          :title="notification.title"
          :variant="notification.variant"
          @remove="removeItem(i)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppNotfication from './AppNotification.vue';
import { notifications } from '../store/notifications';

function removeItem(i: number) {
  notifications.splice(i, 1);
}
</script>

<style lang="postcss" scoped>
.fade-leave-active {
  @apply transition duration-200 ease-linear;
}

.fade-leave-to {
  @apply opacity-0;
}
</style>
