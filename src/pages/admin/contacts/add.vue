<route lang="yaml">
name: adminContactsAdd
meta:
  pageTitle: contacts.addContact
  role: admin
</route>

<template>
  <PageTitle :title="t('contacts.addContact')" border></PageTitle>
  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <AppForm :button-text="t('actions.save')" @submit.prevent="handleSubmit">
      <section class="mb-8">
        <div class="mb-4">
          <AppInput
            v-model="data.email"
            type="email"
            :label="t('form.email')"
            required
          />
        </div>
        <div class="mb-4">
          <AppInput v-model="data.firstname" :label="t('form.firstName')" />
        </div>
        <div class="mb-4">
          <AppInput v-model="data.lastname" :label="t('form.lastName')" />
        </div>
        <AppCheckbox
          v-model="data.subscribeToNewsletter"
          :label="t('addContact.subscribeToNewsletter')"
          class="mb-4"
        />
      </section>
      <section class="mb-8">
        <AppHeading class="mb-4">{{ t('contactOverview.roles') }}</AppHeading>
      </section>
      <section class="mb-8">
        <AppHeading class="mb-4">
          {{ t('contactOverview.contribution') }}
        </AppHeading>
      </section>
      <template #buttons="{ disabled }">
        <AppButton
          variant="linkOutlined"
          :disabled="disabled"
          @click="handleSaveAnother"
        >
          {{ t('actions.saveAndAnother') }}
        </AppButton>
      </template>
    </AppForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import PageTitle from '../../../components/PageTitle.vue';
import { MemberRoleData } from '../../../utils/api/api.interface';

const { t } = useI18n();

const data = reactive({
  email: '',
  firstname: '',
  lastname: '',
  subscribeToNewsletter: false,
  roles: [] as MemberRoleData[],
});

async function handleSubmit() {
  await Promise.resolve();
}

async function handleSaveAnother() {
  await handleSubmit();
}
</script>
