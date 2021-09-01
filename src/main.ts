import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

const app = createApp(App);

const i18n = createI18n({
  locale: 'en',
  messages,
});

app.use(i18n);

app.mount('#app');
