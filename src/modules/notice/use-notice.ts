import { ref } from 'vue';
import { GetNoticeData } from '../../utils/api/api.interface';
import { fetchNotices } from '../../utils/api/notice';

const notices = ref<GetNoticeData[]>([]);
const loading = ref(false);

function setNotices(): void {
  loading.value = true;
  fetchNotices()
    .then((data) => {
      notices.value = data;
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
