import { currentUser, initCurrentUser, updateCurrentUser } from './currentUser';
import { generalContent, initGeneralContent } from './generalContent';

export const initStore = Promise.all([initCurrentUser, initGeneralContent]);

const isEmbed = window.self !== window.top;

export { currentUser, updateCurrentUser, generalContent, isEmbed };
