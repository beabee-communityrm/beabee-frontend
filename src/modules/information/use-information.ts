import { email, helpers, required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive, ref } from 'vue';
import i18n from '../../i18n';
import { fetchInformation, updateInformation } from './information.service';
import { Information, UpdateInformation } from './information.interface';
import { passwordValidator } from '../../utils/form-validation/validators';
import { errorGenerator } from '../../utils/form-error-generator';

const { t } = i18n.global;

const information = reactive<UpdateInformation>({
  emailAddress: '',
  password: '',
  firstName: '',
  lastName: '',
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

const informationValidation = useVuelidate(rules, information);

const isAddressInvalid = ref(false);
const hasAddressError = ref(false);

const isFormInvalid = computed(
  () => informationValidation.value.$invalid || isAddressInvalid.value
);
const hasFormError = computed(
  () => informationValidation.value.$errors.length || hasAddressError.value
);

const loading = ref(false);
const isSaved = ref(false);

const submitFormHandler = async () => {
  loading.value = true;
  isSaved.value = false;
  updateInformation(information)
    .then(() => (isSaved.value = true))
    .catch((err) => err)
    .finally(() => (loading.value = false));
};

const setInformation = async () => {
  const informationData: Information = await fetchInformation();
  information.emailAddress = informationData.email;
  information.firstName = informationData.firstname;
  information.lastName = informationData.lastname;

  const address = informationData.profile?.deliveryAddress;
  if (address) {
    information.addressLine1 = address?.line1;
    information.addressLine2 = address?.line2;
    information.cityOrTown = address?.city;
    information.postCode = address?.postcode;
  }
};

export function useInformation() {
  return {
    informationValidation,
    errorGenerator,
    information,
    submitFormHandler,
    setInformation,
    isFormInvalid,
    isSaved,
    loading,
    isAddressInvalid,
    hasAddressError,
    hasFormError,
  };
}
