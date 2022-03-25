import axios from '../../axios';
import {
  GetMemberDataWith,
  GetMembersQuery,
  GetSegmentData,
  Paginated,
  Serial,
} from './api.interface';
import { toMember } from './member';

export async function fetchSegments(): Promise<GetSegmentData[]> {
  return (await axios.get<Serial<GetSegmentData>[]>('/segments')).data;
}

export async function fetchSegmentMembers(
  id: string,
  query: GetMembersQuery = {}
): Promise<Paginated<GetMemberDataWith<'profile'>>> {
  const { data } = await axios.get(`/segments/${id}/members`, {
    params: { with: ['profile'], ...query },
  });

  return {
    ...data,
    items: data.items.map(toMember),
  };
}
