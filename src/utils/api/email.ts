import axios from '../../lib/axios';
import type { GetEmailData, Serial, UpdateEmailData } from '@type';

export async function fetchEmail(id: string): Promise<GetEmailData | false> {
  return (await axios.get<Serial<GetEmailData>>('/email/' + id)).data;
}

export async function updateEmail(
  id: string,
  data: UpdateEmailData
): Promise<GetEmailData> {
  return (await axios.put<Serial<GetEmailData>>('/email/' + id, data)).data;
}
