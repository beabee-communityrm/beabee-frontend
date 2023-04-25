import { createApp } from 'vue';
import VueMatomo from 'vue-matomo';

import App from './App.vue';

import i18n from './lib/i18n';
import router from './lib/router';

import './lib/theme';

import 'iframe-resizer/js/iframeResizer.contentWindow';

import './index.css';

// fontawesome icons imports
import Icons from './plugins/icons';
import { init as initErrorHandler } from './lib/appsignal';

const app = createApp(App);
initErrorHandler(app);

app.use(VueMatomo, {
  host: 'https://thebristolcable.matomo.cloud',
  siteId: 1,
  router,
  trackInitialView: false, // Seems to always track / as initial view
  enableLinkTracking: true,
  enableHeartBeatTimer: true,
  cookieDomain: '*.thebristolcable.org',
  domains: ['*.membership.thebristolcable.org', '*.thebristolcable.org'],
});

app.use({ ...router });
app.use(i18n);

// icons
app.use(Icons);

app.mount('#app');
