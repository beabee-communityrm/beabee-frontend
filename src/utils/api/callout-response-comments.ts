import { Paginated } from '@beabee/beabee-common';
import { deserializeDate } from '.';
import axios from '../../lib/axios';
import {
  CreateCalloutResponseCommentData,
  GetCalloutResponseCommentData,
  Serial,
} from './api.interface';

export async function fetchCalloutResponseComments(
  responseId: string
): Promise<Paginated<GetCalloutResponseCommentData>> {
  const { data } = await axios.get<
    Paginated<Serial<GetCalloutResponseCommentData>>
  >(`/callout-response-comments`, { params: { responseId: responseId } });
  return {
    ...data,
    items: data.items.map((comment) => deserializeComment(comment)),
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

function deserializeComment(
  comment: Serial<GetCalloutResponseCommentData>
): GetCalloutResponseCommentData {
  return {
    ...comment,
    createdAt: deserializeDate(comment.createdAt),
    updatedAt: deserializeDate(comment.updatedAt),
  };
}
