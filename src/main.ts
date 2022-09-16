import { createApp } from 'vue';
import VueMatomo from 'vue-matomo';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import './theme';

import './index.css';

// fontawesome icons imports
import Icons from './plugins/icons';

const app = createApp(App);
app.use(VueMatomo, {
  host: 'https://stats2.xtreamlab.net',
  siteId: 1,
  trackerFileName: 'piwik',
  router,
  enableLinkTracking: true,
  enableHeartBeatTimer: true,
  cookieDomain: '*.thebristolcable.org',
});

app.use({ ...router });
app.use(i18n);

// icons
app.use(Icons);

app.mount('#app');
