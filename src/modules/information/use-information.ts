import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import i18n from '../../i18n';
import { UpdateInformation } from './information.interface';
import { passwordValidator } from '../../utils/form-validation/validators';
import { errorGenerator } from '../../utils/form-error-generator';
import { fetchMemberWithProfile, updateMember } from '../../utils/api/member';
import { fetchJoinSetupContent } from '../../utils/api/content';
import { JoinSetupContent } from '../../utils/api/api.interface';

const { t } = i18n.global;

const information = reactive<UpdateInformation>({
  emailAddress: '',
  password: '',
  firstName: '',
  lastName: '',
  deliveryOptIn: false,
  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  postCode: '',
});

const rules = computed(() => ({
  emailAddress: {
    required: helpers.withMessage(t('form.errors.email.required'), required),
    email: helpers.withMessage(t('form.errors.email.invalid'), email),
  },

  password: {
    validPassword: helpers.withMessage(
      t('form.errors.password.invalid'),
      passwordValidator
    ),
  },

  firstName: {
    required: helpers.withMessage(
      t('form.errors.firstName.required'),
      required
    ),
  },

  lastName: {
    required: helpers.withMessage(t('form.errors.lastName.required'), required),
  },
}));

// this is a vuelidate instance
const addressValidation = ref<any>({});

const informationValidation = useVuelidate(rules, information);

const hasFormError = computed(
  () =>
    // check errors exist in `addressValidation.value`
    // because it might not exist at first and causes error
    !!(
      informationValidation.value.$errors.length ||
      addressValidation.value.$errors?.length
    )
);

type InfoContent = Pick<
  JoinSetupContent,
  'showMailOptIn' | 'mailTitle' | 'mailText' | 'mailOptIn'
>;

const loading = ref(false);
const isSaved = ref(false);
const infoContent = ref<InfoContent>({
  showMailOptIn: false,
  mailTitle: '',
  mailText: '',
  mailOptIn: '',
});

const initPage = async (id: string) => {
  loading.value = false;
  isSaved.value = false;

  infoContent.value = await fetchJoinSetupContent();

  const member = await fetchMemberWithProfile(id);
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
};

const submitFormHandler = async (id: string) => {
  const isAddressCorrect = await addressValidation.value.$validate();
  const isInformationCorrect = await informationValidation.value.$validate();
  if (!isAddressCorrect || !isInformationCorrect) return;

  loading.value = true;
  isSaved.value = false;

  updateMember(id, {
    email: information.emailAddress,
    firstname: information.firstName,
    lastname: information.lastName,
    ...(information.password && { password: information.password }),
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
  })
    .then(() => (isSaved.value = true))
    .catch((err) => err)
    .finally(() => (loading.value = false));
};

export function useInformation() {
  return {
    informationValidation,
    errorGenerator,
    information,
    submitFormHandler,
    initPage,
    isSaved,
    loading,
    infoContent,
    hasFormError,
    addressValidation,
  };
}
