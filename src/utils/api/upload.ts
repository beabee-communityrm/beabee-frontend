import axios from '@lib/axios';

import type { GetUploadFlowData, Serial } from '@type';

export async function createUploadFlow(): Promise<GetUploadFlowData> {
  const { data } = await axios.post<Serial<GetUploadFlowData>>('/upload');
  return data;
}
