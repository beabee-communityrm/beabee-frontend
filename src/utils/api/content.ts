import axios from '../../axios';
import {
  ContactsContent,
  GeneralContent,
  JoinContent,
  JoinSetupContent,
  ProfileContent,
} from './api.interface';

type ContentId = 'join' | 'join/setup' | 'profile' | 'general' | 'contacts';

type Content<Id extends ContentId> = Id extends 'join'
  ? JoinContent
  : Id extends 'join/setup'
  ? JoinSetupContent
  : Id extends 'profile'
  ? ProfileContent
  : Id extends 'general'
  ? GeneralContent
  : Id extends 'contacts'
  ? ContactsContent
  : never;

async function fetchContent<Id extends ContentId>(
  id: Id
): Promise<Content<Id>> {
  return (await axios.get('/content/' + id)).data;
}

export async function fetchContactsContent(): Promise<ContactsContent> {
  return await fetchContent('contacts');
}
export async function fetchGeneralContent(): Promise<GeneralContent> {
  return await fetchContent('general');
}
export async function fetchJoinContent(): Promise<JoinContent> {
  return await fetchContent('join');
}
export async function fetchJoinSetupContent(): Promise<JoinSetupContent> {
  return await fetchContent('join/setup');
}
export async function fetchProfileContent(): Promise<ProfileContent> {
  return await fetchContent('profile');
}

export async function updateContent<Id extends ContentId>(
  id: Id,
  content: Content<Id>
): Promise<Content<Id>> {
  return (await axios.put('/content/' + id, content)).data;
}
