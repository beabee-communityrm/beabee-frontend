import { currentUser, initCurrentUser, updateCurrentUser } from './currentUser';
import { generalContent, initGeneralContent } from './generalContent';

export const initStore = Promise.all([initCurrentUser, initGeneralContent]);

export { currentUser, updateCurrentUser, generalContent };
