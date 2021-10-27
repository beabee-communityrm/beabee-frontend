import { ref } from 'vue';
import { Notice } from './notice.interface';
import { fetchNotices } from './notice.service';

const notices = ref<Notice[]>([]);
const loading = ref(false);

function setNotices(): void {
  loading.value = true;
  fetchNotices()
    .then(({ data }) => {
      notices.value = data.map((notice: Notice) => {
        return {
          id: notice.id,
          text: notice.text,
          url: notice.url,
          buttonText: notice.buttonText,
        };
      });
    })
    .catch((err) => err)
    .finally(() => (loading.value = false));
}

export function useNotice() {
  return {
    setNotices,
    notices,
  };
}
