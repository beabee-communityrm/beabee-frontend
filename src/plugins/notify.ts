// - TODO: check if you need to add it globally instead of
// importing notify in each file
import mitt from 'mitt';
import {
  Notification,
  NotificationType,
} from '../components/notification/notification.interface';
import i18n from '../i18n';
const { t } = i18n.global;

type EventType = {
  add: Notification;
};

const emitter = mitt<EventType>();

const idGenerator = ((i) => {
  return () => i++;
})(0);

const notify = (notification: Notification): void => {
  notification.id = idGenerator();
  notification.duration = notification.duration || 5000;

  emitter.emit('add', notification);
};

const notifyError = (title: string = t('notification.error')): void => {
  notify({ title: title, type: NotificationType.Error });
};

const notifySuccess = (title: string = t('notification.success')): void => {
  notify({ title: title, type: NotificationType.Success });
};

export { notify, notifyError, notifySuccess, emitter };
