import { ref } from 'vue';
import { BasicCalloutData } from '../../utils/api/api.interface';
import { fetchCallouts } from '../../utils/api/callout';

const callouts = ref<BasicCalloutData[]>([]);
const loading = ref(false);

function setCallouts(): void {
  loading.value = true;
  fetchCallouts()
    .then((data) => {
      callouts.value = data;
    })
    .catch((err) => err)
    .finally(() => (loading.value = false));
}

export function useCallout() {
  return {
    setCallouts,
    callouts,
  };
}
