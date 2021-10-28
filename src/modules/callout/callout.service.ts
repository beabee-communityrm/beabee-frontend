import axios from '../../axios';
import { Callout } from './callout.interface';

function fetchCallouts(): Promise<any> {
  return axios.get('/callout', {
    params: { status: 'open' },
  });
}

async function fetchCallout(slug: string): Promise<Callout | undefined> {
  return (await axios.get('/callout/' + slug)).data;
}

export { fetchCallouts, fetchCallout };
