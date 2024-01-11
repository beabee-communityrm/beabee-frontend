import { instance } from '.';
import type {
  ContentContacts,
  ContentEmail,
  ContentGeneral,
  ContentJoin,
  ContentJoinSetup,
  ContentProfile,
  ContentShare,
} from '@type';

type ContentId =
  | 'join'
  | 'join/setup'
  | 'profile'
  | 'general'
  | 'contacts'
  | 'email'
  | 'share';

type Content<Id extends ContentId> = Id extends 'join'
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

export async function fetchContent<Id extends ContentId>(
  id: Id
): Promise<Content<Id>> {
  return (await instance.get('/content/' + id)).data;
}

export async function updateContent<Id extends ContentId>(
  id: Id,
  content: Partial<Content<Id>>
): Promise<Content<Id>> {
  return (await instance.patch('/content/' + id, content)).data;
}
