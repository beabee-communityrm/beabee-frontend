<template>
  <div
    v-if="visible"
    class="flex flex-1 justify-center rounded border border-primary-20 py-4 px-10"
  >
    <form @submit.prevent="handleFormSubmit" class="flex-initial">
      <div v-if="type === 'new'" class="my-3 py-3">
        <AppSelect v-model="role.role" label="New role" :items="roleOptions" />
      </div>

      <div>
        <div class="my-3 py-3">
          <AppLabel :label="inputT('starts.label')" required />
          <AppRadioGroup
            v-if="type === 'new'"
            name="roleStartDate"
            v-model="roleHasStartDate"
            :options="[
              [false, inputT('starts.opts.now')],
              [true, inputT('starts.opts.schedule')],
            ]"
            required
          />
          <div v-if="roleHasStartDate" class="flex gap-2">
            <div>
              <AppInput type="date" required />
            </div>
            <!--
          <div>
            <AppInput type="time" required />
          </div>
          --></div>
        </div>

        <div class="my-3 py-3">
          <AppRadioGroup
            name="roleEndDate"
            v-model="roleHasEndDate"
            :label="inputT('expires.label')"
            :options="[
              [false, inputT('expires.opts.never')],
              [true, inputT('expires.opts.schedule')],
            ]"
            required
          />
          <div v-if="roleHasEndDate" class="flex gap-2">
            <div>
              <AppInput v-model="newRole.dateExpires" type="date" required />
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
        <AppButton variant="text" class="ml-2" @click="visible = false">{{
          t('form.cancel')
        }}</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import AppLabel from '../../../../components/forms/AppLabel.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';
import AppDateInput from '../../../../components/forms/AppDateInput.vue';
import { onBeforeMount, ref, reactive } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue?: number | string;
    type?: 'new' | 'edit';
    name?: string;
    role?: string;
    visible?: boolean;
  }>(),
  {
    modelValue: undefined,
    type: 'new',
    name: 'unknown',
    role: undefined,
    visible: false,
  }
);

const { t, n } = useI18n();
const inputT = (key: string) => t('contacts.data.rolesCopy.' + key);

const roleHasStartDate = ref(false);
const roleHasEndDate = ref(false);
const loading = ref(false);
const role = reactive({
  role: '',
  dateAdded: '',
  dateExpires: '',
});

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

async function handleNewRoleFormSubmit() {
  newRoleFormLoading.value = true;
  if (!newRole.dateAdded) {
    newRole.dateAdded = new Date();
  }
  if (!newRole.dateExpires) {
    newRole.dateExpires = new Date();
    newRole.dateExpires.setFullYear(newRole.dateExpires.getFullYear() + 10);
  }
  try {
    await updateRole(props.contact.id, newRole.role, {
      dateAdded: newRole.dateAdded,
      dateExpires: newRole.dateExpires,
    });
  } finally {
    newRoleFormLoading.value = false;
    isNewRoleFormVisible.value = false;
  }
}

async function handleEditRoleFormSubmit() {
  editRoleFormLoading.value = true;
  try {
    await updateRole(props.contact.id, editRole.role, {
      dateAdded: editRole.dateAdded,
      dateExpires: editRole.dateExpires,
    });
  } finally {
    editRoleFormLoading.value = false;
    isEditRoleFormVisible.value = false;
  }
}

async function openEditRoleForm(role) {
  editRole.role = role.role;
  editRole.dateAdded = role.dateAdded;
  editRole.dateExpires = role.dateExpires;
  isEditRoleFormVisible.value = true;
}

onBeforeMount(async () => {
  loading.value = false;
});
</script>
