import { ref } from 'vue';
import { Callout } from './callout.interface';
import { fetchCallouts } from './callout.service';

const callouts = ref<Callout[]>([]);
const loading = ref(false);

function setCallouts(): void {
  loading.value = true;
  fetchCallouts()
    .then(({ data }) => {
      callouts.value = data.map((callout: Callout) => {
        return {
          title: callout.title,
          slug: callout.slug,
          expires: callout.expires,
          excerpt: callout.excerpt,
          image: callout.image,
        };
      });
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
