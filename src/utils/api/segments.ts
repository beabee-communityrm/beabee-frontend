import axios from '../../lib/axios';
import {
  CreateSegmentData,
  GetSegmentData,
  GetSegmentDataWith,
  GetSegmentWith,
  Serial,
  UpdateSegmentData,
} from './api.interface';

export async function fetchSegments<With extends GetSegmentWith = void>(
  _with?: readonly With[]
): Promise<GetSegmentDataWith<With>[]> {
  const { data } = await axios.get<Serial<GetSegmentDataWith<With>>[]>(
    '/segments',
    {
      params: { with: _with },
    }
  );
  // TODO: needs Serial type guard
  return data as GetSegmentDataWith<With>[];
}

export async function fetchSegment<With extends GetSegmentWith = void>(
  id: string,
  _with?: readonly With[]
): Promise<GetSegmentDataWith<With>> {
  const { data } = await axios.get<Serial<GetSegmentData>>('/segments/' + id, {
    params: { with: _with },
  });
  // TODO: needs Serial type guard
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
