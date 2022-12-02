<template>
  <div>
    <RoleEditorItem
      v-for="role in contact.roles"
      :key="role.role"
      :role="role"
      :contact="contact"
      @changed="emit('changed')"
    />

    <AppButton
      class="mt-3 w-full"
      variant="primaryOutlined"
      @click="formVisible = !formVisible"
    >
      {{ t('roleEditor.add') }}
    </AppButton>

    <RoleEditorForm
      v-if="formVisible"
      class="rounded rounded-t-none border border-primary-20 bg-primary-10 p-4"
      @cancel="formVisible = false"
      @save="handleSaveNew"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../forms/AppButton.vue';
import RoleEditorItem from './RoleEditorItem.vue';
import {
  GetMemberDataWith,
  MemberRoleData,
} from '../../utils/api/api.interface';
import { updateRole } from '../..//utils/api/member';
import RoleEditorForm from './RoleEditorForm.vue';

const emit = defineEmits(['changed']);
const props = defineProps<{
  contact: GetMemberDataWith<'roles'>;
}>();

const { t } = useI18n();

const formVisible = ref(false);

async function handleSaveNew(role: MemberRoleData) {
  await updateRole(props.contact.id, role.role, role);
  formVisible.value = false;
  emit('changed');
}
</script>
