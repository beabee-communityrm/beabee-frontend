import axios from '../../axios';

function fetchMember(): Promise<any> {
  return axios.get('/member/me');
}

function fetchProfileContent(): Promise<any> {
  return axios.get('/content/profile');
}

export { fetchMember, fetchProfileContent };
