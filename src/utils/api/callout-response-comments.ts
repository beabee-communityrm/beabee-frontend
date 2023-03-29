import { deserializeDate } from '.';
import axios from '../../lib/axios';
import {
  CreateCalloutResponseCommentData,
  GetCalloutResponseCommentData,
  GetCalloutResponseCommentsQuery,
  Serial,
  UpdateCalloutResponseCommentData,
} from './api.interface';
import { deserializeContact } from './contact';
import { Paginated } from '@beabee/beabee-common';

export async function fetchCalloutResponseComments(
  query: GetCalloutResponseCommentsQuery
): Promise<Paginated<GetCalloutResponseCommentData>> {
  const { data } = await axios.get<
    Paginated<Serial<GetCalloutResponseCommentData>>
  >(`/callout-response-comments`, { params: query });
  return {
    ...data,
    items: data.items.map(deserializeComment),
  };
}

export async function createCalloutResponseComment(
  dataIn: CreateCalloutResponseCommentData
): Promise<GetCalloutResponseCommentData> {
  const { data } = await axios.post<Serial<GetCalloutResponseCommentData>>(
    '/callout-response-comments',
    dataIn
  );
  return deserializeComment(data);
}

export async function deleteCalloutResponseComment(id: string): Promise<void> {
  await axios.delete('/callout-response-comments/' + id);
}

export async function updateCalloutResponseComment(
  id: string,
  dataIn: UpdateCalloutResponseCommentData
): Promise<GetCalloutResponseCommentData> {
  const { data } = await axios.patch<Serial<GetCalloutResponseCommentData>>(
    '/callout-response-comments/' + id,
    dataIn
  );
  return deserializeComment(data);
}

export function deserializeComment(
  comment: Serial<GetCalloutResponseCommentData>
): GetCalloutResponseCommentData {
  return {
    ...comment,
    createdAt: deserializeDate(comment.createdAt),
    updatedAt: deserializeDate(comment.updatedAt),
    contact: deserializeContact(comment.contact),
  };
}
