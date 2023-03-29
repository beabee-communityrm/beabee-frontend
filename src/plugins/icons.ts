import { Library, library } from '@fortawesome/fontawesome-svg-core';

import {
  faFacebook,
  faLinkedin,
  faTelegram,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons';

import { faCalendar as farCalendar } from '@fortawesome/free-regular-svg-icons';

import {
  faSignInAlt,
  faAddressCard,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faStepBackward,
  faStepForward,
  faCaretUp,
  faExclamation,
  faHouse,
  faInfoCircle,
  faBullhorn,
  faKey,
  faMagic,
  faBomb,
  faTimes,
  faCircleNotch,
  faCheck,
  faCheckCircle,
  faUser,
  faUsers,
  faSearch,
  faShare,
  faThumbsUp,
  faEye,
  faEyeSlash,
  faCog,
  faExternalLinkAlt,
  faPencilAlt,
  faNewspaper,
  faClone,
  faTrash,
  faLink,
  faHandSparkles,
  faTag,
  faCopy,
  faEnvelope,
  faCreditCard,
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
  faHeading,
  faList,
  faListOl,
  faHandsHelping,
  faChartLine,
  faWindowRestore,
  faSort,
  faPlus,
  faReply,
  faCircleDot,
  faCircleArrowRight,
  faFloppyDisk,
  faThList,
  faSignHanging,
  faFolder,
  faFilter,
  faDownload,
  faComment,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  farCalendar,
  faFolder,
  faHouse,
  faAddressCard,
  faSignInAlt,
  faCaretLeft,
  faCaretRight,
  faCaretDown,
  faCaretUp,
  faStepBackward,
  faStepForward,
  faInfoCircle,
  faExclamation,
  faBullhorn,
  faKey,
  faMagic,
  faDownload,
  faBomb,
  faTimes,
  faCircleNotch,
  faCheck,
  faCheckCircle,
  faUser,
  faUsers,
  faSearch,
  faShare,
  faThumbsUp,
  faEye,
  faEyeSlash,
  faCog,
  faExternalLinkAlt,
  faPencilAlt,
  faFilter,
  faNewspaper,
  faClone,
  faTrash,
  faLink,
  faHandSparkles,
  faTag,
  faCreditCard,
  faTag,
  faCopy,
  faFacebook,
  faLinkedin,
  faTelegram,
  faTwitter,
  faWhatsapp,
  faEnvelope,
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
  faHeading,
  faList,
  faListOl,
  faHandsHelping,
  faChartLine,
  faComment,
  faUserPen,
  faWindowRestore,
  faSort,
  faPlus,
  faReply,
  faCircleDot,
  faCircleArrowRight,
  faFloppyDisk,
  faThList,
  faSignHanging
);

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { App } from 'vue';

export default {
  install(app: App): Library {
    app.component('FontAwesomeIcon', FontAwesomeIcon);

    return library;
  },
};
