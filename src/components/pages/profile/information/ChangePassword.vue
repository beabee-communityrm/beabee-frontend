<template>
  <AppHeading class="mb-3">
    {{ t('informationPage.loginDetail') }}
  </AppHeading>

  <MessageBox v-if="saved" class="mb-4" type="success">{{
    t('informationPage.savedPassword')
  }}</MessageBox>
  <AppButton
    v-if="!showForm"
    variant="primaryOutlined"
    icon="key"
    @click="
      showForm = true;
      saved = false;
    "
  >
    {{ t('informationPage.changePassword') }}
  </AppButton>
  <form v-else @submit.prevent="handleFormSubmit">
    <div class="mb-5">
      <AppInput
        v-model="password"
        type="password"
        name="password"
        required
        :label="t('form.newPassword')"
        :info-message="t('form.passwordInfo')"
      />
    </div>
    <div class="mb-5">
      <AppInput
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        required
        :same-as="password"
        :label="t('form.newPasswordConfirm')"
      />
    </div>
    <MessageBox v-if="hasFormError" type="error" class="mt-2" />
    <div class="flex mt-2">
      <AppButton
        type="submit"
        :disabled="disableSubmit"
        :loading="loading"
        variant="link"
        >{{ t('form.saveChanges') }}</AppButton
      >
      <AppButton variant="text" class="ml-2" @click="showForm = false">{{
        t('form.cancel')
      }}</AppButton>
    </div>
  </form>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { updateMember } from '../../../../utils/api/member';
import AppButton from '../../../forms/AppButton.vue';
import MessageBox from '../../../MessageBox.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppHeading from '../../../AppHeading.vue';

const { t } = useI18n();

const showForm = ref(false);
const loading = ref(false);
const saved = ref(false);
const password = ref('');
const confirmPassword = ref('');

const validation = useVuelidate();

const hasFormError = computed(() => validation.value.$errors.length > 0);

const disableSubmit = computed(
  () => hasFormError.value || password.value === ''
);

async function handleFormSubmit() {
  loading.value = true;

  try {
    await updateMember('me', { password: password.value });
    saved.value = true;
    showForm.value = false;
  } finally {
    loading.value = false;
  }
}

onBeforeMount(() => {
  loading.value = false;
  saved.value = false;
  showForm.value = false;
  password.value = '';
  confirmPassword.value = '';
});
</script>
