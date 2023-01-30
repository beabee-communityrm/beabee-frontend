<template>
  <AppHeading class="mb-3">
    {{ t('accountPage.loginDetail') }}
  </AppHeading>

  <MessageBox v-if="saved" class="mb-4" type="success">{{
    t('accountPage.savedPassword')
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
    {{ t('accountPage.changePassword') }}
  </AppButton>

  <AppForm
    v-else
    :button-text="t('form.saveChanges')"
    :reset-button-text="t('form.cancel')"
    @submit="handleFormSubmit"
    @reset="showForm = false"
  >
    <div class="mb-4">
      <AppInput
        v-model="password"
        type="password"
        name="password"
        required
        :label="t('form.newPassword')"
        :info-message="t('form.passwordInfo')"
      />
    </div>
    <div class="mb-4">
      <AppInput
        v-model="confirmPassword"
        type="password"
        name="confirmPassword"
        required
        :same-as="password"
        :label="t('form.newPasswordConfirm')"
      />
    </div>
  </AppForm>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { updateContact } from '../../../../utils/api/contact';
import AppButton from '../../../forms/AppButton.vue';
import MessageBox from '../../../MessageBox.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppHeading from '../../../AppHeading.vue';
import AppForm from '../../../forms/AppForm.vue';

const { t } = useI18n();

const showForm = ref(false);
const saved = ref(false);
const password = ref('');
const confirmPassword = ref('');

async function handleFormSubmit() {
  await updateContact('me', { password: password.value });
  saved.value = true;
  showForm.value = false;
}

onBeforeMount(() => {
  saved.value = false;
  showForm.value = false;
  password.value = '';
  confirmPassword.value = '';
});
</script>
