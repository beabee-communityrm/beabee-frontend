import { computed } from 'vue';
import { generalContent } from '../store';
import defaultBgUrl from '../assets/images/auth-bg.jpg';

export default computed(() => ({
  backgroundImage: `url(${generalContent.value.backgroundUrl || defaultBgUrl})`,
}));
