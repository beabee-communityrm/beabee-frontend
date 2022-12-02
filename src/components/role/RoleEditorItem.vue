<template>
  <div class="mt-3 rounded border border-primary-20 bg-primary-10">
    <div class="flex items-center bg-primary-5 px-4 py-1 text-sm">
      <AppRoundBadge :type="isRoleCurrent(role) ? 'success' : 'danger'" />
      <strong class="mx-2 font-bold uppercase text-body-80">
        {{ t(`common.role.${role.role}`) }}
      </strong>
      <span>
        {{ formatLocale(role.dateAdded, 'P') + ' → ' }}
        {{
          role.dateExpires
            ? formatLocale(role.dateExpires, 'P')
            : t('roleEditor.today')
        }}
      </span>
      <div class="ml-auto -mr-3">
        <AppButton variant="text" size="sm" @click="formVisible = true">{{
          t('actions.edit')
        }}</AppButton>
        <AppButton
          variant="dangerText"
          size="sm"
          @click="showDeleteModal = true"
        >
          {{ t('actions.delete') }}
        </AppButton>

        <AppConfirmDialog
          :open="showDeleteModal"
          :title="t('roleEditor.confirmDelete.title')"
          :cancel="t('roleEditor.confirmDelete.actionNo')"
          :confirm="t('roleEditor.confirmDelete.actionYes')"
          variant="danger"
          @close="showDeleteModal = false"
          @confirm="handleDeleteRole"
        >
          <p>{{ t('roleEditor.confirmDelete.text') }}</p>
        </AppConfirmDialog>
      </div>
    </div>

    <RoleEditorForm
      v-if="formVisible"
      class="p-4"
      :role="role"
      @save="handleUpdateRole"
      @cancel="formVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../forms/AppButton.vue';
import AppRoundBadge from '../AppRoundBadge.vue';
import AppConfirmDialog from '../AppConfirmDialog.vue';
import { MemberRoleData, GetMemberData } from '../../utils/api/api.interface';
import { updateRole, deleteRole } from '../../utils/api/member';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import RoleEditorForm from './RoleEditorForm.vue';

const props = defineProps<{
  role: MemberRoleData;
  contact: GetMemberData;
}>();
const emit = defineEmits(['changed']);

const { t } = useI18n();
const formVisible = ref(false);
const showDeleteModal = ref(false);

function isRoleCurrent(role: MemberRoleData): boolean {
  const now = new Date();
  return role.dateAdded < now && (!role.dateExpires || role.dateExpires > now);
}

async function handleUpdateRole(role: MemberRoleData) {
  await updateRole(props.contact.id, role.role, role);
  emit('changed');
}

async function handleDeleteRole() {
  await deleteRole(props.contact.id, props.role.role);
  emit('changed');
}
</script>
