<template>
  <form @submit.prevent="handleSubmit()">
    <AppHeading class="mt-6 mb-2">
      {{ t('informationPage.contactInformation') }}
    </AppHeading>

    <ContactInformation
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

    <MessageBox
      v-if="validation.$errors.length > 0"
      type="error"
      class="mt-2"
    />

    <MessageBox v-if="isSaved" type="success" class="mt-2">
      {{ t('form.saved') }}
    </MessageBox>

    <AppButton
      type="submit"
      :disabled="validation.$invalid"
      class="mt-6"
      :loading="loading"
      variant="link"
      >{{ t('form.saveChanges') }}</AppButton
    >
  </form>
</template>
<script lang="ts" setup>
import AppButton from '../../../forms/AppButton.vue';
import ContactInformation from '../../../ContactInformation.vue';
import MessageBox from '../../../MessageBox.vue';
import AppAddress from '../../../AppAddress.vue';
import ContactMailOptIn from '../../../ContactMailOptIn.vue';
import { useI18n } from 'vue-i18n';
import { computed, reactive, ref, toRef, watch } from 'vue';
import AppHeading from '../../../AppHeading.vue';
import useVuelidate from '@vuelidate/core';
import { fetchContent } from '../../../../utils/api/content';
import { fetchMember, updateMember } from '../../../../utils/api/member';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';

const props = defineProps<{
  id: string;
}>();

const { t } = useI18n();

const isAdmin = computed(() => props.id !== 'me');
const loading = ref(false);
const isSaved = ref(false);

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
    const member = await fetchMember(id, ['profile']);

    information.emailAddress = member.email;
    information.firstName = member.firstname;
    information.lastName = member.lastname;
    information.deliveryOptIn = member.profile.deliveryOptIn;

    const address = member.profile.deliveryAddress;
    information.addressLine1 = address?.line1 || '';
    information.addressLine2 = address?.line2 || '';
    information.cityOrTown = address?.city || '';
    information.postCode = address?.postcode || '';
  },
  { immediate: true }
);

const validation = useVuelidate();

async function handleSubmit() {
  loading.value = true;
  isSaved.value = false;

  try {
    await updateMember(props.id, {
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
    isSaved.value = true;
  } finally {
    loading.value = false;
  }
}
</script>
