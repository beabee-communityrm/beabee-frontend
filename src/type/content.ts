import type {
  ContentContacts,
  ContentEmail,
  ContentGeneral,
  ContentJoin,
  ContentJoinSetup,
  ContentProfile,
  ContentShare,
  ContentId,
} from '@type';

export type Content<Id extends ContentId> = Id extends 'join'
  ? ContentJoin
  : Id extends 'join/setup'
    ? ContentJoinSetup
    : Id extends 'profile'
      ? ContentProfile
      : Id extends 'general'
        ? ContentGeneral
        : Id extends 'contacts'
          ? ContentContacts
          : Id extends 'email'
            ? ContentEmail
            : Id extends 'share'
              ? ContentShare
              : never;
