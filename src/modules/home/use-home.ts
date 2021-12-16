import { computed, reactive } from 'vue';
import { Member, ProfileContent } from './home.interface';
import { fetchMember, fetchProfileContent } from './home.service';

const member = reactive<Member>({
  firstName: '',
  joined: '',
  contributionPeriod: '',
  contributionAmount: 0,
});

function setMember(): void {
  fetchMember()
    .then(({ data }) => {
      member.firstName = data.firstname;
      member.joined = data.joined;
      member.contributionPeriod = data.contributionPeriod;
      member.contributionAmount = data.contributionAmount;
    })
    .catch((err) => err);
}

const profileContent = reactive<ProfileContent>({
  welcomeMessage: '',
  footerMessage: '',
  introMessage: '',
});

function setProfileContent(): void {
  fetchProfileContent()
    .then(({ data }) => {
      profileContent.welcomeMessage = data.welcomeMessage;
      profileContent.footerMessage = data.footerMessage;
      profileContent.introMessage = data.introMessage;
    })
    .catch((err) => err);
}

const contributionInfo = computed(() => {
  const { joined, contributionAmount, contributionPeriod } = member;
  return { joined, contributionAmount, contributionPeriod };
});

export function useHome() {
  return {
    setMember,
    member,
    contributionInfo,
    setProfileContent,
    profileContent,
  };
}
