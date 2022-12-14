<template>
  <AppForm
    :button-text="t('form.saveChanges')"
    :success-text="t('form.saved')"
    @submit="handleSubmit"
  >
    <AppHeading class="mt-6 mb-2">
      {{ t('informationPage.contactInformation') }}
    </AppHeading>

    <ContactBasicInformationFields
      v-model:email="information.emailAddress"
      v-model:firstName="information.firstName"
      v-model:lastName="information.lastName"
      :optional-names="isAdmin"
    />

    <AppHeading class="mt-6 mb-2">
      {{ t('informationPage.deliveryAddress') }}
    </AppHeading>

    <template v-if="infoContent.showMailOptIn">
      <AppRadioGroup
        v-if="isAdmin"
        v-model="information.deliveryOptIn"
        name="deliveryOptIn"
        :label="t('contactInformation.deliveryOptIn')"
        :options="[
          [true, t('common.yes')],
          [false, t('common.no')],
        ]"
        class="mb-4"
        inline
      />
      <ContactMailOptIn
        v-else
        v-model="information.deliveryOptIn"
        :content="infoContent"
      />
    </template>

    <AppAddress
      v-model:line1="information.addressLine1"
      v-model:line2="information.addressLine2"
      v-model:postCode="information.postCode"
      v-model:cityOrTown="information.cityOrTown"
      :required="information.deliveryOptIn"
    />
  </AppForm>
</template>
<script lang="ts" setup>
import { computed, reactive, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppAddress from '../AppAddress.vue';
import ContactBasicInformationFields from './ContactBasicInformationFields.vue';
import ContactMailOptIn from './ContactMailOptIn.vue';
import AppHeading from '../AppHeading.vue';
import { fetchContent } from '../../utils/api/content';
import { fetchContact, updateContact } from '../../utils/api/contact';
import AppRadioGroup from '../forms/AppRadioGroup.vue';
import AppForm from '../forms/AppForm.vue';

const props = defineProps<{
  id: string;
}>();

const { t } = useI18n();

const isAdmin = computed(() => props.id !== 'me');

const infoContent = await fetchContent('join/setup');

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

watch(
  toRef(props, 'id'),
  async (id) => {
    const contact = await fetchContact(id, ['profile']);

    information.emailAddress = contact.email;
    information.firstName = contact.firstname;
    information.lastName = contact.lastname;
    information.deliveryOptIn = contact.profile.deliveryOptIn;

    const address = contact.profile.deliveryAddress;
    information.addressLine1 = address?.line1 || '';
    information.addressLine2 = address?.line2 || '';
    information.cityOrTown = address?.city || '';
    information.postCode = address?.postcode || '';
  },
  { immediate: true }
);

async function handleSubmit() {
  await updateContact(props.id, {
    email: information.emailAddress,
    firstname: information.firstName,
    lastname: information.lastName,
    profile: {
      ...(infoContent.showMailOptIn && {
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
}
</script>
