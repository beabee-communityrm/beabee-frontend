import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import './index.css';

// fontawesome icons imports
import Icons from './plugins/icons';

const app = createApp(App);

app.use({ ...router });
app.use(i18n);

// icons
app.use(Icons);

app.mount('#app');
