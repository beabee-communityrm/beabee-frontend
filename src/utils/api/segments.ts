import { Paginated } from '@beabee/beabee-common';
import axios from '../../axios';
import {
  CreateSegmentData,
  GetContactData,
  GetContactDataWith,
  GetContactsQuery,
  GetContactWith,
  GetSegmentData,
  GetSegmentDataWith,
  GetSegmentWith,
  Serial,
  UpdateSegmentData,
} from './api.interface';
import { deserializeContact } from './contact';

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

export async function fetchSegmentContacts(
  id: string,
  query: GetContactsQuery
): Promise<Paginated<GetContactData>>;
export async function fetchSegmentContacts<With extends GetContactWith>(
  id: string,
  query: GetContactsQuery,
  _with: readonly With[]
): Promise<Paginated<GetContactDataWith<With>>>;
export async function fetchSegmentContacts<With extends GetContactWith>(
  id: string,
  query: GetContactsQuery = {},
  _with?: readonly With[]
): Promise<Paginated<GetContactDataWith<With>>> {
  const { data } = await axios.get(`/segments/${id}/contacts`, {
    params: { with: _with, ...query },
  });

  return {
    ...data,
    items: data.items.map(deserializeContact),
  };
}
