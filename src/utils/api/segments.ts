import axios from '../../axios';
import {
  GetMemberData,
  GetMemberDataWith,
  GetMembersQuery,
  GetMemberWith,
  GetSegmentData,
  Paginated,
  Serial,
} from './api.interface';
import { deserializeMember } from './member';

export async function fetchSegments(): Promise<GetSegmentData[]> {
  return (await axios.get<Serial<GetSegmentData>[]>('/segments')).data;
}

export async function fetchSegmentMembers(
  id: string,
  query: GetMembersQuery
): Promise<Paginated<GetMemberData>>;
export async function fetchSegmentMembers<With extends GetMemberWith>(
  id: string,
  query: GetMembersQuery,
  _with: readonly With[]
): Promise<Paginated<GetMemberDataWith<With>>>;
export async function fetchSegmentMembers<With extends GetMemberWith>(
  id: string,
  query: GetMembersQuery = {},
  _with?: readonly With[]
): Promise<Paginated<GetMemberDataWith<With>>> {
  const { data } = await axios.get(`/segments/${id}/members`, {
    params: { with: _with, ...query },
  });

  return {
    ...data,
    items: data.items.map(deserializeMember),
  };
}
