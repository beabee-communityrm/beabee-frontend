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
          : t('contacts.data.rolesCopy.today')
      }}
      <div class="ml-auto">
        <AppButton variant="text" size="sm" @click="formVisible = true"
          >Edit</AppButton
        >
        <AppButton variant="dangerText" size="sm" @click="handleDeleteRole">
          Delete
        </AppButton>
      </div>
    </div>

    <div v-if="formVisible" class="flex flex-1 p-4">
      <form @submit.prevent="handleFormSubmit" class="flex-initial">
        <div>
          <div class="my-2 py-1">
            <AppLabel :label="inputT('starts.label')" required />
            <div class="flex gap-2">
              <div>
                <AppInput v-model="editRole.startDate" type="date" required />
              </div>
              <div>
                <AppInput v-model="editRole.startTime" type="time" required />
              </div>
            </div>
          </div>

          <div class="my-2 py-1">
            <AppLabel :label="inputT('expires.label')" required />
            <div class="flex gap-2">
              <div>
                <AppInput v-model="editRole.endDate" type="date" required />
              </div>
              <div>
                <AppInput v-model="editRole.endTime" type="time" required />
              </div>
            </div>
          </div>
        </div>

        <div class="my-3 flex py-3">
          <AppButton type="submit" variant="primary" :loading="loading">{{
            t('form.save')
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
}>();
const editRole = reactive({
  role: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
});

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
      dateAdded: roleHasStartDate.value
        ? parseDateTime(editRole.startDate, editRole.startTime)
        : new Date(),
      dateExpires: roleHasEndDate.value
        ? parseDateTime(editRole.endDate, editRole.endTime)
        : null,
    });
  } finally {
    // TODO: update item view
    loading.value = false;
    formVisible.value = false;
  }
}

async function handleDeleteRole(role) {
  try {
    await deleteRole(props.contact.id, props.role.role);
  } finally {
    // TODO: Remove item from view
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
  editRole.role = props.role.role;
  editRole.startDate = props.role.dateAdded.toLocaleDateString();
  editRole.startTime = props.role.dateAdded.toLocaleTimeString();
  if (props.role.dateExpires) {
    editRole.endDate = props.role.dateExpires.toLocaleDateString();
    editRole.endTime = props.role.dateExpires.toLocaleTimeString();
  }
  console.log(editRole);
});
</script>
