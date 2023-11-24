import axios from '../../lib/axios';
import type { GetStatsData, GetStatsQuery, Serial } from '@type';

export async function fetchStats(query: GetStatsQuery): Promise<GetStatsData> {
  return (await axios.get<Serial<GetStatsData>>('/stats', { params: query }))
    .data;
}
