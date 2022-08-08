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
        input-type="password"
        :label="t('form.newPassword')"
        :info-message="t('form.passwordInfo')"
        :error-message="errorGenerator(passwordValidation, 'password')"
        @blur="passwordValidation.password.$touch"
      />
    </div>
    <div class="mb-5">
      <AppInput
        v-model="confirmPassword"
        input-type="password"
        :label="t('form.newPasswordConfirm')"
        :error-message="errorGenerator(passwordValidation, 'confirmPassword')"
        @blur="passwordValidation.confirmPassword.$touch"
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
import { helpers, sameAs } from '@vuelidate/validators';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { passwordValidator } from '../../../../utils/form-validation/validators';
import { errorGenerator } from '../../../../utils/form-error-generator';
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

const rules = {
  password: {
    validPassword: helpers.withMessage(
      t('form.errors.password.invalid'),
      passwordValidator
    ),
  },
  confirmPassword: {
    sameAs: helpers.withMessage(
      t('form.errors.password.sameAs'),
      sameAs(password)
    ),
  },
};

const passwordValidation = useVuelidate(rules, { password, confirmPassword });

const hasFormError = computed(
  () => passwordValidation.value.$errors.length > 0
);

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
