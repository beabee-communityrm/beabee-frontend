import Appsignal from '@appsignal/javascript';
import { errorHandler } from '@appsignal/vue';
import { App } from 'vue';
import env from '../env';

export function init(app: App) {
  if (env.appsignalKey) {
    const appsignal = new Appsignal({
      key: env.appsignalKey,
      revision: env.revision,
    });
    app.config.errorHandler = errorHandler(appsignal, app);
  }
}
