import { email, helpers, required, requiredIf } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { computed, reactive } from 'vue';
import i18n from '../../i18n';
import { fetchInformation, updateInformation } from './information.service';
import { Information, UpdateInformation } from './information.interface';

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

const addressFieldError = t('informationPage.form.errors.address.required');
const mustBeValidPassword = (value: string) => {
  // validates only if user enters password
  if (!value) return true;
  return (
    value.length >= 8 &&
    /[0-9]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value)
  );
};

const rules = computed(() => ({
  emailAddress: {
    required: helpers.withMessage(
      t('informationPage.form.errors.email.required'),
      required
    ),
    email: helpers.withMessage(
      t('informationPage.form.errors.email.invalid'),
      email
    ),
  },

  password: {
    validPassword: helpers.withMessage(
      t('informationPage.form.errors.password.invalid'),
      mustBeValidPassword
    ),
  },

  firstName: {
    required: helpers.withMessage(
      t('informationPage.form.errors.firstName.required'),
      required
    ),
  },

  lastName: {
    required: helpers.withMessage(
      t('informationPage.form.errors.lastName.required'),
      required
    ),
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

const touchAddressFields = () => {
  v$.value.addressLine1.$touch();
  v$.value.addressLine2.$touch();
  v$.value.cityOrTown.$touch();
  v$.value.postCode.$touch();
};

const errorGenerator = (validationProperty: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return v$.value[validationProperty].$errors[0]?.$message;
};

const v$ = useVuelidate(rules, information);

const submitFormHandler = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  updateInformation(information);
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
    v$,
    errorGenerator,
    information,
    submitFormHandler,
    touchAddressFields,
    setInformation,
  };
}
