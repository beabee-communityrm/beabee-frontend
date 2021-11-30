import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import i18n from '../../i18n';
import { fetchInformation, updateInformation } from './information.service';
import { Information } from './information.interface';
import { passwordValidator } from '../../utils/form-validation/validators';
import { errorGenerator } from '../../utils/form-error-generator';
import { useRoute } from 'vue-router';

const { t } = i18n.global;

const information = reactive<Information>({
  emailAddress: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  deliveryOptIn: false,
  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  postCode: '',
  description: '',
  notes: '',
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

const loading = ref(false);
const isSaved = ref(false);

const submitFormHandler = async () => {
  const isAddressCorrect = await addressValidation.value.$validate();
  const isInformationCorrect = await informationValidation.value.$validate();
  if (!isAddressCorrect || !isInformationCorrect) return;

  loading.value = true;
  isSaved.value = false;
  updateInformation(information)
    .then(() => (isSaved.value = true))
    .catch((err) => err)
    .finally(() => (loading.value = false));
};

const setInformation = () => {
  const id = useRoute().params.id as string;
  fetchInformation(id)
    .then(({ data }) => {
      information.emailAddress = data.email;
      information.firstName = data.firstname;
      information.lastName = data.lastname;

      const address = data.profile?.deliveryAddress;
      if (address) {
        information.addressLine1 = address?.line1;
        information.addressLine2 = address?.line2;
        information.cityOrTown = address?.city;
        information.postCode = address?.postcode;
      }
    })
    .catch((err) => err);
};

const isContactPage = computed(() => {
  return useRoute().name === 'contact information';
});

export function useInformation() {
  return {
    informationValidation,
    errorGenerator,
    information,
    submitFormHandler,
    setInformation,
    isSaved,
    loading,
    hasFormError,
    addressValidation,
    isContactPage,
  };
}
