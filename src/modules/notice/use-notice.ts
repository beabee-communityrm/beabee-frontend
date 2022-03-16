import { ref } from 'vue';
import { ItemStatus, GetNoticeData } from '../../utils/api/api.interface';
import { fetchNotices } from '../../utils/api/notice';

const notices = ref<GetNoticeData[]>([]);
const loading = ref(false);

function setNotices(): void {
  loading.value = true;
  fetchNotices({
    rules: {
      condition: 'AND',
      rules: [{ field: 'status', operator: 'equal', value: ItemStatus.Open }],
    },
  })
    .then((data) => {
      notices.value = data.items;
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
