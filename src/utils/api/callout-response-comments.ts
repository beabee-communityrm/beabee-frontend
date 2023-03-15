import { Paginated } from '@beabee/beabee-common';
import { deserializeDate } from '.';
import axios from '../../lib/axios';
import { GetCalloutResponseCommentData, Serial } from './api.interface';

export async function fetchCalloutResponseComments(
  responseId: string
): Promise<Paginated<GetCalloutResponseCommentData>> {
  const { data } = await axios.get<
    Paginated<Serial<GetCalloutResponseCommentData>>
  >(`/callout-response-comments`, { params: { responseId: responseId } });
  return {
    ...data,
    items: data.items.map((comment) => ({
      ...comment,
      createdAt: deserializeDate(comment.createdAt),
    })),
  };
}
