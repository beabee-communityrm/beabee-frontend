import { Paginated } from '@beabee/beabee-common';
import axios from '../../axios';
import {
  CreateSegmentData,
  GetMemberData,
  GetMemberDataWith,
  GetMembersQuery,
  GetMemberWith,
  GetSegmentData,
  GetSegmentDataWith,
  GetSegmentWith,
  Serial,
  UpdateSegmentData,
} from './api.interface';
import { deserializeMember } from './member';

export async function fetchSegments(): Promise<GetSegmentData[]>;
export async function fetchSegments<With extends GetSegmentWith>(
  _with: readonly With[]
): Promise<GetSegmentDataWith<With>[]>;
export async function fetchSegments<With extends GetSegmentWith>(
  _with?: readonly With[]
): Promise<GetSegmentDataWith<With>[]> {
  const { data } = await axios.get<Serial<GetSegmentDataWith<With>>[]>(
    '/segments',
    {
      params: { with: _with },
    }
  );
  return data as GetSegmentDataWith<With>[];
}

export async function fetchSegment(id: string): Promise<GetSegmentData>;
export async function fetchSegment<With extends GetSegmentWith>(
  id: string,
  _with: readonly With[]
): Promise<GetSegmentDataWith<With>>;
export async function fetchSegment<With extends GetSegmentWith>(
  id: string,
  _with?: readonly With[]
): Promise<GetSegmentDataWith<With>> {
  const { data } = await axios.get<Serial<GetSegmentData>>('/segments/' + id, {
    params: { with: _with },
  });
  return data as GetSegmentDataWith<With>;
}

export async function createSegment(
  dataIn: CreateSegmentData
): Promise<GetSegmentDataWith<'contactCount'>> {
  const { data } = await axios.post<Serial<GetSegmentDataWith<'contactCount'>>>(
    '/segments/',
    {
      name: dataIn.name,
      order: dataIn.order,
      ruleGroup: dataIn.ruleGroup,
      description: '', // TODO: deprecated from API
    }
  );
  return data;
}

export async function updateSegment(
  id: string,
  dataIn: UpdateSegmentData
): Promise<GetSegmentDataWith<'contactCount'>> {
  const { data } = await axios.patch<
    Serial<GetSegmentDataWith<'contactCount'>>
  >('/segments/' + id, {
    name: dataIn.name,
    order: dataIn.order,
    ruleGroup: dataIn.ruleGroup,
  });
  return data;
}

export async function deleteSegment(id: string): Promise<void> {
  await axios.delete('/segments/' + id);
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
