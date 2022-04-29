import { reactive, ref } from 'vue';
import { fetchMember, updateMember } from '../../utils/api/member';
import { fetchJoinSetupContent } from '../../utils/api/content';

const information = reactive({
  emailAddress: '',
  firstName: '',
  lastName: '',
  deliveryOptIn: false,
  addressLine1: '',
  addressLine2: '' as string | undefined,
  cityOrTown: '',
  postCode: '',
});

const loading = ref(false);
const isSaved = ref(false);
const infoContent = ref({
  showMailOptIn: false,
  mailTitle: '',
  mailText: '',
  mailOptIn: '',
});

async function initPage(id: string) {
  loading.value = false;
  isSaved.value = false;

  infoContent.value = await fetchJoinSetupContent();

  const member = await fetchMember(id, ['profile']);
  information.emailAddress = member.email;
  information.firstName = member.firstname;
  information.lastName = member.lastname;
  information.deliveryOptIn = member.profile.deliveryOptIn;

  const address = member.profile.deliveryAddress;
  if (address) {
    information.addressLine1 = address?.line1;
    information.addressLine2 = address?.line2;
    information.cityOrTown = address?.city;
    information.postCode = address?.postcode;
  }
}

async function submitFormHandler(id: string) {
  loading.value = true;
  isSaved.value = false;

  try {
    await updateMember(id, {
      email: information.emailAddress,
      firstname: information.firstName,
      lastname: information.lastName,
      profile: {
        ...(infoContent.value.showMailOptIn && {
          deliveryOptIn: information.deliveryOptIn,
        }),
        deliveryAddress: {
          line1: information.addressLine1,
          line2: information.addressLine2,
          city: information.cityOrTown,
          postcode: information.postCode,
        },
      },
    });
    isSaved.value = true;
  } finally {
    loading.value = false;
  }
}

export function useInformation() {
  return {
    information,
    submitFormHandler,
    initPage,
    isSaved,
    loading,
    infoContent,
  };
}
