<template>
  <div>
    <div
      v-for="role in contact.roles"
      :key="role.role + role.dateAdded.toJSON()"
    >
      <RoleEditorItem
        :key="role.role + role.dateAdded.toJSON()"
        :role="role"
        :contact="contact"
        @update="emit('update')"
      />
    </div>

    <div class="mt-3">
      <AppButton
        class="w-full !bg-primary-5"
        variant="primaryOutlined"
        @click="formVisible = true"
        >{{ t('contacts.data.roles.add') }}</AppButton
      >
    </div>

    <div
      v-if="formVisible"
      class="flex flex-1 rounded border border-primary-20 bg-primary-10 p-4"
    >
      <form class="flex-initial" @submit.prevent="handleFormSubmit">
        <div class="my-2 py-1">
          <AppSelect
            v-model="newRole.role"
            label="New role"
            :items="roleOptions"
          />
        </div>

        <div>
          <div class="my-2 py-1">
            <AppLabel :label="t('contacts.data.roles.starts.label')" required />
            <AppRadioGroup
              v-model="roleHasStartDate"
              name="roleStartDate"
              :options="[
                [false, t('contacts.data.roles.starts.opts.now')],
                [true, t('contacts.data.roles.starts.opts.schedule')],
              ]"
              required
            />
            <div v-if="roleHasStartDate" class="flex gap-2">
              <div>
                <AppInput v-model="newRole.startDate" type="date" required />
              </div>
              <div>
                <AppInput v-model="newRole.startTime" type="time" required />
              </div>
            </div>
          </div>

          <div class="my-2 py-1">
            <AppRadioGroup
              v-model="roleHasEndDate"
              name="roleEndDate"
              :label="t('contacts.data.roles.expires.label')"
              :options="[
                [false, t('contacts.data.roles.expires.opts.never')],
                [true, t('contacts.data.roles.expires.opts.schedule')],
              ]"
              required
            />
            <div v-if="roleHasEndDate" class="flex gap-2">
              <div>
                <AppInput v-model="newRole.endDate" type="date" required />
              </div>
              <div>
                <AppInput v-model="newRole.endTime" type="time" required />
              </div>
            </div>
          </div>
        </div>

        <div class="my-3 flex py-3">
          <AppButton
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="validation.$invalid"
            >{{ t('contacts.data.roles.add') }}</AppButton
          >
          <AppButton variant="text" class="ml-2" @click="formVisible = false">{{
            t('form.cancel')
          }}</AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppLabel from '../../../../components/forms/AppLabel.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';
import RoleEditorItem from '../../../../components/pages/admin/contacts/RoleEditorItem.vue';
import { GetMemberDataWith } from '../../../../utils/api/api.interface';
import { EditableRole } from './roles.interface';
import { updateRole } from '../../../../utils/api/member';
import { onBeforeMount, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

const emit = defineEmits(['update']);
const props = defineProps<{
  contact: GetMemberDataWith<'roles'>;
}>();

const { t } = useI18n();
const validation = useVuelidate();

const loading = ref(false);
const formVisible = ref(false);
const roleHasStartDate = ref(false);
const roleHasEndDate = ref(false);
const newRole = reactive<EditableRole>({
  role: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
});

const roleOptions = [
  {
    id: 'member',
    label: t('common.role.member'),
  },
  {
    id: 'admin',
    label: t('common.role.admin'),
  },
  {
    id: 'superadmin',
    label: t('common.role.superadmin'),
  },
];

async function handleFormSubmit() {
  if (!newRole.role) return;
  loading.value = true;
  try {
    await updateRole(props.contact.id, newRole.role, {
      dateAdded: roleHasStartDate.value
        ? parseDateTime(newRole.startDate, newRole.startTime)
        : new Date(),
      dateExpires: roleHasEndDate.value
        ? parseDateTime(newRole.endDate, newRole.endTime)
        : null,
    });
  } finally {
    emit('update');
    loading.value = false;
    formVisible.value = false;
  }
}

function parseDateTime(date: string, time: string): Date {
  return new Date(date + 'T' + time);
}

onBeforeMount(async () => {
  loading.value = false;
});
</script>
