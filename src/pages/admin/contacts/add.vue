<route lang="yaml">
name: adminContactsAdd
meta:
  pageTitle: contacts.addContact
  role: admin
</route>

<template>
  <PageTitle :title="t('contacts.addContact')" border></PageTitle>
  <div class="grid lg:grid-cols-2">
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
        <RoleEditor
          :roles="data.roles"
          @delete="handleDeleteRole"
          @update="handleUpdateRole"
        />
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
import { PermissionType } from '@beabee/beabee-common';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import PageTitle from '../../../components/PageTitle.vue';
import RoleEditor from '../../../components/role/RoleEditor.vue';
import { MemberRoleData } from '../../../utils/api/api.interface';

const { t } = useI18n();

const data = reactive({
  email: '',
  firstname: '',
  lastname: '',
  subscribeToNewsletter: false,
  roles: [] as MemberRoleData[],
});

function handleUpdateRole(role: MemberRoleData) {
  const existingRole = data.roles.find((r) => r.role === role.role);
  if (existingRole) {
    existingRole.dateAdded = role.dateAdded;
    existingRole.dateExpires = role.dateExpires;
  } else {
    data.roles.push(role);
  }
}

function handleDeleteRole(roleName: PermissionType) {
  data.roles = data.roles.filter((role) => role.role !== roleName);
}

async function handleSubmit() {
  await Promise.resolve();
}

async function handleSaveAnother() {
  await handleSubmit();
}
</script>
