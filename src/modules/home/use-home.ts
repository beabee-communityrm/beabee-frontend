import { reactive, ref } from 'vue';
import { GetMemberData, ProfileContent } from '../../utils/api/api.interface';
import { fetchProfileContent } from '../../utils/api/content';
import { fetchMember } from '../../utils/api/member';

const member = reactive<GetMemberData>({
  id: '',
  email: '',
  firstname: '',
  lastname: '',
  joined: new Date(),
  activeRoles: [],
});

const profileContent = ref<ProfileContent>({
  welcomeMessage: '',
  footerMessage: '',
  introMessage: '',
});

async function initHomePage() {
  const memberData = await fetchMember('me');
  member.firstname = memberData.firstname;
  member.joined = memberData.joined;
  member.contributionPeriod = memberData.contributionPeriod;
  member.contributionAmount = memberData.contributionAmount;

  profileContent.value = await fetchProfileContent();
}

export function useHome() {
  return {
    initHomePage,
    member,
    profileContent,
  };
}
