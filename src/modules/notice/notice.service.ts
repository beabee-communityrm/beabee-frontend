import axios from '../../axios';

function fetchNotices(): Promise<any> {
  return axios.get('/notice', {
    params: { status: 'open' },
  });
}

export { fetchNotices };
