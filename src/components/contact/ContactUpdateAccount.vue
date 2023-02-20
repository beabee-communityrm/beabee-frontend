<template>
  <AppForm
    :button-text="t('form.saveChanges')"
    :success-text="t('form.saved')"
    @submit="handleSubmit"
  >
    <AppHeading class="mt-6 mb-2">
      {{ t('accountPage.contactInformation') }}
    </AppHeading>

    <ContactBasicFields
      v-model:email="data.emailAddress"
      v-model:firstName="data.firstName"
      v-model:lastName="data.lastName"
      :optional-names="isAdmin"
    />

    <div class="mb-3">
      <AppInput
        v-model="data.telephone"
        :label="t('form.phone')"
        :info-message="
          isAdmin ? t('accountPage.phoneInfoAdmin') : t('accountPage.phoneInfo')
        "
      />
    </div>

    <AppHeading class="mt-6 mb-2">
      {{ t('accountPage.deliveryAddress') }}
    </AppHeading>

    <template v-if="accountContent.showMailOptIn">
      <AppRadioGroup
        v-if="isAdmin"
        v-model="data.deliveryOptIn"
        name="deliveryOptIn"
        :label="t('accountPage.deliveryOptIn')"
        :options="[
          [true, t('common.yes')],
          [false, t('common.no')],
        ]"
        class="mb-4"
        inline
      />
      <ContactMailOptIn
        v-else
        v-model="data.deliveryOptIn"
        :content="accountContent"
      />
    </template>

    <AppAddress
      v-model:line1="data.addressLine1"
      v-model:line2="data.addressLine2"
      v-model:postCode="data.postCode"
      v-model:cityOrTown="data.cityOrTown"
      :required="data.deliveryOptIn"
    />
  </AppForm>
</template>
<script lang="ts" setup>
import { computed, reactive, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppAddress from '../AppAddress.vue';
import ContactBasicFields from './ContactBasicFields.vue';
import ContactMailOptIn from './ContactMailOptIn.vue';
import AppHeading from '../AppHeading.vue';
import { fetchContent } from '../../utils/api/content';
import { fetchContact, updateContact } from '../../utils/api/contact';
import AppRadioGroup from '../forms/AppRadioGroup.vue';
import AppForm from '../forms/AppForm.vue';
import AppInput from '../forms/AppInput.vue';

const props = defineProps<{
  id: string;
}>();

const { t } = useI18n();

const isAdmin = computed(() => props.id !== 'me');

const accountContent = await fetchContent('join/setup');

const data = reactive({
  emailAddress: '',
  firstName: '',
  lastName: '',
  telephone: '',
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

    data.emailAddress = contact.email;
    data.firstName = contact.firstname;
    data.lastName = contact.lastname;
    data.telephone = contact.profile.telephone;
    data.deliveryOptIn = contact.profile.deliveryOptIn;

    const address = contact.profile.deliveryAddress;
    data.addressLine1 = address?.line1 || '';
    data.addressLine2 = address?.line2 || '';
    data.cityOrTown = address?.city || '';
    data.postCode = address?.postcode || '';
  },
  { immediate: true }
);

async function handleSubmit() {
  await updateContact(props.id, {
    email: data.emailAddress,
    firstname: data.firstName,
    lastname: data.lastName,
    profile: {
      telephone: data.telephone,
      ...(accountContent.showMailOptIn && {
        deliveryOptIn: data.deliveryOptIn,
      }),
      deliveryAddress: {
        line1: data.addressLine1,
        line2: data.addressLine2,
        city: data.cityOrTown,
        postcode: data.postCode,
      },
    },
  });
}
</script>
