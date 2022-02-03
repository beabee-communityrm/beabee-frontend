<template>
  <form @submit.prevent="submitFormHandler(contact.id)">
    <div class="grid lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <AppHeading class="mb-3">
          {{ t('informationPage.contactInformation') }}
        </AppHeading>

        <div class="mb-5">
          <AppInput
            v-model="information.emailAddress"
            input-type="email"
            :label="t('form.email') + '*'"
            :error-message="
              errorGenerator(informationValidation, 'emailAddress')
            "
            @blur="informationValidation.emailAddress.$touch"
          />
        </div>

        <div class="mb-5">
          <AppInput
            v-model="information.firstName"
            input-type="text"
            :label="t('form.firstName') + '*'"
            :error-message="errorGenerator(informationValidation, 'firstName')"
            @blur="informationValidation.firstName.$touch"
          />
        </div>

        <div class="mb-5">
          <AppInput
            v-model="information.lastName"
            input-type="text"
            :label="t('form.lastName') + '*'"
            :error-message="errorGenerator(informationValidation, 'lastName')"
            @blur="informationValidation.lastName.$touch"
          />
        </div>

        <AppHeading class="mb-3">
          {{ t('informationPage.deliveryAddress') }}
        </AppHeading>

        <template v-if="infoContent">
          <p class="text-lg mb-1">
            {{ infoContent.mailTitle }}
          </p>

          <p class="mb-4 text-sm">
            {{ infoContent.mailText }}
          </p>

          <div class="mb-4">
            <input
              id="deliveryOptIn"
              v-model="information.deliveryOptIn"
              type="checkbox"
              name="updates"
            />

            <label for="deliveryOptIn" class="font-bold ml-1">
              {{ infoContent.mailOptIn }}
            </label>
          </div>
        </template>

        <AppAddress
          v-model:line1="information.addressLine1"
          v-model:line2="information.addressLine2"
          v-model:postCode="information.postCode"
          v-model:cityOrTown="information.cityOrTown"
          v-model:addressValidation="addressValidation"
          :is-address-required="information.deliveryOptIn"
        />

        <MessageBox v-if="hasFormError" type="error" class="mt-2" />

        <MessageBox v-if="isSaved" type="success" class="mt-2">
          {{ t('form.saved') }}
        </MessageBox>

        <AppButton
          type="submit"
          :disabled="hasFormError"
          class="mt-2"
          :loading="loading"
          variant="link"
          >{{ t('form.saveChanges') }}</AppButton
        >
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInformation } from '../../information/use-information';
import AppButton from '../../../components/forms/AppButton.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import MessageBox from '../../../components/MessageBox.vue';
import AppAddress from '../../../components/AppAddress.vue';
import AppHeading from '../../../components/AppHeading.vue';
import { GetMemberData } from '../../../utils/api/api.interface';

const props = defineProps<{
  contact: GetMemberData;
}>();

const {
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
} = useInformation();

onBeforeMount(() => initPage(props.contact.id));

const { t } = useI18n();
</script>
