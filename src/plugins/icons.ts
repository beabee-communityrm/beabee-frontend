import { Library, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { App } from 'vue';

export default {
  install(app: App): Library {
    app.component('FontAwesomeIcon', FontAwesomeIcon);

    return library;
  },
};
