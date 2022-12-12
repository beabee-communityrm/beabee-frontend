import Appsignal from '@appsignal/javascript';
import { errorHandler } from '@appsignal/vue';
import { createApp } from 'vue';

import App from './App.vue';
import env from './env';
import i18n from './i18n';
import router from './router';

import './theme';

import './index.css';

// fontawesome icons imports
import Icons from './plugins/icons';

const appsignal = new Appsignal({
  key: '8114cb92-a109-4e64-bf24-865b6143ea22',
  revision: env.revision,
});

const app = createApp(App);
app.config.errorHandler = errorHandler(appsignal, app);

app.use({ ...router });
app.use(i18n);

// icons
app.use(Icons);

app.mount('#app');
