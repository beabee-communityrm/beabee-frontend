import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';

// i18n
import messages from '@intlify/vite-plugin-vue-i18n/messages';

import './index.css';

// fontawesome icons imports
import Icons from './plugins/icons';

const app = createApp(App);

const i18n = createI18n({
  locale: 'en',
  messages,
});

app.use({ ...i18n, ...router });

// icons
app.use(Icons);

app.mount('#app');
