import axios from '../../lib/axios';
import { GetEmailData, Serial, UpdateEmailData } from './api.interface';

export async function fetchEmail(id: string): Promise<GetEmailData | false> {
  return (await axios.get<Serial<GetEmailData>>('/email/' + id)).data;
}

export async function updateEmail(
  id: string,
  data: UpdateEmailData
): Promise<GetEmailData> {
  return (await axios.put<Serial<GetEmailData>>('/email/' + id, data)).data;
}
