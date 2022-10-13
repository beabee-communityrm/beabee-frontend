<template>
  <div>
    <div
      class="mt-4 flex items-center rounded border border-primary-20 px-2.5 py-1"
    >
      <AppRoundBadge
        :type="isRoleCurrent(role) ? 'success' : 'danger'"
        class="mx-2"
      />
      <strong class="mx-2 text-sm font-bold uppercase">
        {{ t(`common.role.${role.role}`) }}
      </strong>
      {{ formatLocale(role.dateAdded, 'P') + ' → ' }}
      {{
        role.dateExpires
          ? formatLocale(role.dateExpires, 'P')
          : t('contacts.data.rolesCopy.today')
      }}
      <div class="ml-auto">
        <AppButton variant="text" size="sm" @click="formVisible = true"
          >Edit</AppButton
        >
        <AppButton variant="dangerText" size="sm" @click="handleDeleteRole">
          Delete role
        </AppButton>
      </div>
    </div>

    <div
      v-if="formVisible"
      class="flex flex-1 justify-center rounded border border-primary-20 py-4 px-10"
    >
      <form @submit.prevent="handleFormSubmit" class="flex-initial">

        <div>
          <div class="my-3 py-3">
            <AppLabel :label="inputT('starts.label')" required />
            <div class="flex gap-2">
              <div>
                <AppInput v-model="role.dateAdded" type="date" required />
              </div>
              <!--
            <div>
              <AppInput type="time" required />
            </div>
            --></div>
          </div>

          <div class="my-3 py-3">
            <AppLabel :label="inputT('expires.label')" required />
            <div class="flex gap-2">
              <div>
                <AppInput v-model="role.dateExpires" type="date" required />
              </div>
              <!--
            <div>
              <AppInput v-model="role.dateExpires" type="time" required />
            </div>
          -->
            </div>
          </div>
        </div>

        <div class="my-3 flex py-3">
          <AppButton type="submit" variant="primary" :loading="loading"
            >Add role</AppButton
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
import AppRoundBadge from '../../../../components/AppRoundBadge.vue';
import { MemberRoleData } from '../../../../utils/api/api.interface';
import { updateRole, deleteRole } from '../../../../utils/api/member';
import { onBeforeMount, ref, reactive } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatLocale } from '../../../../utils/dates/locale-date-formats';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  role: MemberRoleData;
  contact: GetMemberData;
}>() ;

const { t, n } = useI18n();
const inputT = (key: string) => t('contacts.data.rolesCopy.' + key);

const formVisible = ref(false);
const roleHasStartDate = ref(false);
const roleHasEndDate = ref(false);
const loading = ref(false);

// FIXME: hardcoded
const roleOptions = [
  {
    id: 'member',
    label: 'Member',
  },
  {
    id: 'admin',
    label: 'Admin',
  },
];

async function handleFormSubmit() {
  loading.value = true;
  try {
    await updateRole(props.contact.id, editRole.role, {
      dateAdded: editRole.dateAdded,
      dateExpires: editRole.dateExpires,
    });
  } finally {
    loading.value = false;
    formVisible.value = false;
  }
}

async function handleDeleteRole(role) {
  try {
    await deleteRole(props.contact.id, props.role.role);
  } finally {
    loading.value = false;
    formVisible.value = false;
  }
}

function isRoleCurrent(role: MemberRoleData): boolean {
  const now = new Date();
  return role.dateAdded < now && (!role.dateExpires || role.dateExpires > now);
}

onBeforeMount(async () => {
  loading.value = false;
});
</script>
