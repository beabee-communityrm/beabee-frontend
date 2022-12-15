import Appsignal from '@appsignal/javascript';
import { errorHandler } from '@appsignal/vue';
import { createApp } from 'vue';

import App from './App.vue';
import env from './env';

import i18n from './lib/i18n';
import router from './lib/router';

import './lib/theme';

import './index.css';

// fontawesome icons imports
import Icons from './plugins/icons';

const app = createApp(App);
if (env.appsignalKey) {
  const appsignal = new Appsignal({
    key: env.appsignalKey,
    revision: env.revision,
  });
  app.config.errorHandler = errorHandler(appsignal, app);
}

app.use({ ...router });
app.use(i18n);

// icons
app.use(Icons);

app.mount('#app');
