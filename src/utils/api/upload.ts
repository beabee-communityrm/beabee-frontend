import axios from '../../lib/axios';

import { GetUploadFlowData, Serial } from './api.interface';

export async function createUploadFlow(): Promise<GetUploadFlowData> {
  const { data } = await axios.post<Serial<GetUploadFlowData>>('/upload');
  return data;
}
