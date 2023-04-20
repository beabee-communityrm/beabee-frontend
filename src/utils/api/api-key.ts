import axios from 'axios';
import {
  CreateApiKeyData,
  GetApiKeyData,
  GetApiKeysQuery,
  GetTokenData,
  Serial,
} from './api.interface';
import { deserializeDate } from '.';
import { Paginated } from '@beabee/beabee-common';

export async function createApiKey(
  dataIn: CreateApiKeyData
): Promise<GetTokenData> {
  const { data } = await axios.post<Serial<GetTokenData>>('/api-user', dataIn);
  return data;
}

export async function fetchApiKeys(
  query?: GetApiKeysQuery
): Promise<Paginated<GetApiKeyData>> {
  const { data } = await axios.get<Paginated<Serial<GetApiKeyData>>>(
    '/api-user',
    {
      params: query,
    }
  );

  return {
    ...data,
    items: data.items.map((apiKey) => ({
      ...apiKey,
      joined: deserializeDate(apiKey.joined),
    })),
  };
}

export async function deleteApiKey(id: string) {
  await axios.delete('/api-user/' + id);
}
