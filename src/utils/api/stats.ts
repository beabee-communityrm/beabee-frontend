import axios from '../../lib/axios';
import { GetStatsData, GetStatsQuery, Serial } from './api.interface';

export async function fetchStats(query: GetStatsQuery): Promise<GetStatsData> {
  return (await axios.get<Serial<GetStatsData>>('/stats', { params: query }))
    .data;
}
