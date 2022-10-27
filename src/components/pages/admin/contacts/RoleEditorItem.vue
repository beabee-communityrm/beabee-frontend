<template>
  <div class="mt-3 rounded border border-primary-20 bg-primary-10">
    <div class="flex items-center bg-primary-5 px-4 py-1 text-sm">
      <AppRoundBadge :type="isRoleCurrent(role) ? 'success' : 'danger'" />
      <strong class="mx-2 font-bold uppercase text-body-80">
        {{ t(`common.role.${role.role}`) }}
      </strong>
      <span>{{ formatLocale(role.dateAdded, 'P') + ' → ' }}</span>
      {{
        role.dateExpires
          ? formatLocale(role.dateExpires, 'P')
          : t('contacts.data.roles.today')
      }}
      <div class="ml-auto">
        <AppButton variant="text" size="sm" @click="formVisible = true"
          >Edit</AppButton
        >
        <AppButton
          variant="dangerText"
          size="sm"
          @click="showDeleteModal = true"
        >
          Delete
        </AppButton>

        <AppConfirmDialog
          v-if="showDeleteModal"
          open
          @close="showDeleteModal = false"
          @confirm="handleDeleteRole"
        >
          <template #title>
            {{ t('contacts.data.roles.confirmDelete.title') }}
          </template>
          <template #text>
            {{ t('contacts.data.roles.confirmDelete.text') }}
          </template>
          <template #button-cancel-text>
            {{ t('contacts.data.roles.confirmDelete.actionNo') }}
          </template>
          <template #button-confirm-text>
            {{ t('contacts.data.roles.confirmDelete.actionYes') }}
          </template>
        </AppConfirmDialog>
      </div>
    </div>

    <div v-if="formVisible" class="flex flex-1 p-4">
      <form class="flex-initial" @submit.prevent="handleFormSubmit">
        <div>
          <div class="my-2 py-1">
            <AppLabel :label="t('contacts.data.roles.starts.label')" />
            <div class="flex gap-2">
              <div>
                <AppInput v-model="editRole.startDate" type="date" />
              </div>
              <div>
                <AppInput v-model="editRole.startTime" type="time" />
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
            <div class="flex gap-2">
              <div>
                <AppInput v-model="editRole.endDate" type="date" />
              </div>
              <div>
                <AppInput v-model="editRole.endTime" type="time" />
              </div>
            </div>
          </div>
        </div>

        <div class="my-3 flex py-3">
          <AppButton type="submit" variant="primary" :loading="loading">{{
            t('form.saveChanges')
          }}</AppButton>
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
import AppRoundBadge from '../../../../components/AppRoundBadge.vue';
import AppConfirmDialog from '../../../../components/AppConfirmDialog.vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';
import {
  MemberRoleData,
  GetMemberData,
} from '../../../../utils/api/api.interface';
import { updateRole, deleteRole } from '../../../../utils/api/member';
import { onBeforeMount, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatLocale } from '../../../../utils/dates/locale-date-formats';

const props = defineProps<{
  role: MemberRoleData;
  contact: GetMemberData;
}>();
const emit = defineEmits(['update']);
const editRole = reactive({
  role: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
});

const { t } = useI18n();
const formVisible = ref(false);
const roleHasEndDate = ref(false);
const showDeleteModal = ref(false);
const loading = ref(false);

async function handleFormSubmit() {
  loading.value = true;
  try {
    await updateRole(props.contact.id, editRole.role, {
      dateAdded: parseDateTime(editRole.startDate, editRole.startTime),
      dateExpires: roleHasEndDate.value
        ? parseDateTime(editRole.endDate, editRole.endTime)
        : null,
    });
  } finally {
    emit('update');
    loading.value = false;
    formVisible.value = false;
  }
}

async function handleDeleteRole() {
  try {
    await deleteRole(props.contact.id, props.role.role);
  } finally {
    emit('update');
    loading.value = false;
    formVisible.value = false;
  }
}

function isRoleCurrent(role: MemberRoleData): boolean {
  const now = new Date();
  return role.dateAdded < now && (!role.dateExpires || role.dateExpires > now);
}

function parseDateTime(date: string, time: string): Date {
  return new Date(date + 'T' + time);
}

onBeforeMount(async () => {
  loading.value = false;
  editRole.role = props.role.role;
  editRole.startDate = props.role.dateAdded.toISOString().split('T')[0];
  editRole.startTime = props.role.dateAdded
    .toISOString()
    .split('T')[1]
    .slice(0, 5);
  if (props.role.dateExpires) {
    editRole.endDate = props.role.dateExpires.toISOString().split('T')[0];
    editRole.endTime = props.role.dateExpires
      .toISOString()
      .split('T')[1]
      .slice(0, 5);
  }
  if (editRole.endDate) {
    roleHasEndDate.value = true;
  }
});
</script>
