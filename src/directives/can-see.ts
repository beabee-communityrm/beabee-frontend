import { App } from 'vue';
import { Roles } from '../utils/enums/roles.enum';

export default {
  install(app: App) {
    app.directive('can-see', {
      // - TODO: is it better to replace this with `beforeMount` -
      // using beforeMount is not possible with this approach
      // because parent node is not mounted
      mounted(el, binding) {
        // if it's an empty array it mean's all users can see it
        if (!binding.value.length) return;

        const localStorageUser = localStorage.getItem('user');
        const currentUser = localStorageUser
          ? JSON.parse(localStorageUser)
          : null;

        const roleIndex = currentUser.roles.findIndex((role: Roles) => {
          return binding.value.includes(role);
        });

        const isAuthorized = roleIndex > -1;

        if (!isAuthorized) {
          if (el.parentNode) el.parentNode.removeChild(el);
        }
      },
    });
  },
};
