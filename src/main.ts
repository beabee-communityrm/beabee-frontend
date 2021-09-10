import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';

// i18n
import messages from '@intlify/vite-plugin-vue-i18n/messages';

import './index.css';

// fontawesome icons imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faAddressCard as farAddressCard,
  faBuilding as farBuilding,
  faCalendarCheck as farCalendarCheck,
  faCreditCard as farCreditCard,
  faUser as farUser,
} from '@fortawesome/free-regular-svg-icons';
import { faSignInAlt, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const app = createApp(App);

const i18n = createI18n({
  locale: 'en',
  messages,
});

app.use({ ...i18n, ...router });

// icons
library.add(
  farBuilding,
  farUser,
  farCalendarCheck,
  farAddressCard,
  farCreditCard,
  faSignInAlt,
  faCaretDown
);
app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');
