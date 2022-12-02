<template>
  <div>
    <RoleEditorItem
      v-for="role in roles"
      :key="role.role"
      :role="role"
      @delete="emit('delete', $event)"
      @update="emit('update', $event)"
    />

    <template v-if="availableRoles.length > 0">
      <div
        v-if="formVisible"
        class="mt-3 rounded rounded-t-none border border-primary-20 bg-primary-10 p-4"
      >
        <AppSubHeading class="mb-4">
          {{ t('roleEditor.addNewRole') }}
        </AppSubHeading>
        <RoleEditorForm
          :available-roles="availableRoles"
          @cancel="formVisible = false"
          @save="handleSaveNew"
        />
      </div>
      <AppButton
        v-else
        class="mt-3 w-full"
        variant="primaryOutlined"
        @click="formVisible = true"
      >
        {{ t('roleEditor.add') }}
      </AppButton>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppButton from '../forms/AppButton.vue';
import RoleEditorItem from './RoleEditorItem.vue';
import { MemberRoleData } from '../../utils/api/api.interface';
import RoleEditorForm from './RoleEditorForm.vue';
import { PermissionTypes } from '@beabee/beabee-common';
import AppSubHeading from '../AppSubHeading.vue';

const emit = defineEmits(['delete', 'update']);
const props = defineProps<{ roles: MemberRoleData[] }>();

const { t } = useI18n();

const formVisible = ref(false);

const availableRoles = computed(() =>
  PermissionTypes.filter((type) =>
    props.roles.every((role) => role.role !== type)
  )
);

async function handleSaveNew(role: MemberRoleData) {
  formVisible.value = false;
  emit('update', role);
}
</script>
