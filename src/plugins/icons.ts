import { Library, library } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressCard as farAddressCard,
  faBuilding as farBuilding,
  faCalendar as farCalendar,
  faCalendarCheck as farCalendarCheck,
  faCreditCard as farCreditCard,
  faUser as farUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faSignInAlt,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faCaretUp,
  faExclamation,
  faInfoCircle,
  faBullhorn,
  faKey,
  faMagic,
  faBomb,
  faTimes,
  faCircleNotch,
  faCheck,
  faCheckCircle,
  faUsers,
  faSearch,
  faShare,
  faThumbsUp,
  faEye,
  faEyeSlash,
  faCogs,
  faExternalLinkAlt,
  faPencilAlt,
  faNewspaper,
  faClone,
  faTrash,
  faLink,
  faTag,
  faBold,
  faItalic,
  faStrikethrough,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  farBuilding,
  farUser,
  farCalendar,
  farCalendarCheck,
  farAddressCard,
  farCreditCard,
  faSignInAlt,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faCaretUp,
  faInfoCircle,
  faExclamation,
  faBullhorn,
  faKey,
  faMagic,
  faBomb,
  faTimes,
  faCircleNotch,
  faCheck,
  faCheckCircle,
  faUsers,
  faSearch,
  faShare,
  faThumbsUp,
  faEye,
  faEyeSlash,
  faCogs,
  faExternalLinkAlt,
  faPencilAlt,
  faNewspaper,
  faClone,
  faTrash,
  faLink,
  faTag,
  faBold,
  faItalic,
  faStrikethrough
);

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { App } from 'vue';

export default {
  install(app: App): Library {
    app.component('FontAwesomeIcon', FontAwesomeIcon);

    return library;
  },
};
