import axios from '../../axios';

function fetchCallouts(): Promise<any> {
  return axios.get('/callout', {
    params: { status: 'open' },
  });
}

export { fetchCallouts };
