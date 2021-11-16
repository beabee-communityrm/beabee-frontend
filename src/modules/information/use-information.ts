import { email, helpers, required, requiredIf } from '@vuelidate/validators';
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

const addressFieldError = t('form.errors.address.required');

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

  addressLine1: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(
        information.postCode ||
          information.cityOrTown ||
          !!information.addressLine2
      )
    ),
  },
  // no validation is needed for this field
  // but it should be present for 'v$.addressLine2.$touch'
  addressLine2: {},
  cityOrTown: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(
        information.addressLine1 ||
          information.addressLine2 ||
          information.postCode
      )
    ),
  },

  postCode: {
    required: helpers.withMessage(
      addressFieldError,
      requiredIf(
        information?.addressLine1 ||
          information.addressLine2 ||
          information.cityOrTown
      )
    ),
  },
}));

const isFormInvalid = computed(() => v$.value.$invalid);

const touchAddressFields = () => {
  v$.value.addressLine1.$touch();
  v$.value.addressLine2.$touch();
  v$.value.cityOrTown.$touch();
  v$.value.postCode.$touch();
};

const v$ = useVuelidate(rules, information);

const loading = ref(false);
const isSaved = ref(false);

const submitFormHandler = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
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
  // for validating form on load

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
    v$,
    errorGenerator,
    information,
    submitFormHandler,
    touchAddressFields,
    setInformation,
    isFormInvalid,
    isSaved,
    loading,
  };
}
