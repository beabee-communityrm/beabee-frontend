import { Component, reactive } from 'vue';

interface Notification {
  title: string;
  variant: 'success' | 'warning' | 'error';
  body?: Component;
}

export const notifications = reactive<Notification[]>([]);

export function addNotification(notification: Notification) {
  notifications.push(notification);
}
