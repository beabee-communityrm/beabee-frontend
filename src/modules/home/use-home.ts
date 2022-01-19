import { reactive } from 'vue';
import { Member } from '../../utils/interfaces/member.interface';
import { ProfileContent } from './home.interface';
import { fetchMember, fetchProfileContent } from './home.service';

const member = reactive<Member>({
  firstname: '',
  joined: '',
  contributionPeriod: '',
  contributionAmount: 0,
});

const profileContent = reactive<ProfileContent>({
  welcomeMessage: '',
  footerMessage: '',
  introMessage: '',
});

async function initHomePage() {
  const memberData = (await fetchMember()).data;
  member.firstname = memberData.firstname;
  member.joined = memberData.joined;
  member.contributionPeriod = memberData.contributionPeriod;
  member.contributionAmount = memberData.contributionAmount;

  const profile = (await fetchProfileContent()).data;
  profileContent.welcomeMessage = profile.welcomeMessage;
  profileContent.footerMessage = profile.footerMessage;
  profileContent.introMessage = profile.introMessage;
}

export function useHome() {
  return {
    initHomePage,
    member,
    profileContent,
  };
}
