<template>
  <div>
    <div v-for="role in contact.roles" :key="role.role">
      <RoleEditorItem :role="role" />
    </div>

    <div>
      <AppButton
        variant="primaryOutlined"
        @click="formVisible = true"
        class="w-full !bg-primary-5"
        >Add role</AppButton
      >
    </div>

    <div v-if="formVisible" class="flex flex-1 justify-center rounded border border-primary-20 py-4 px-10" >
      <form @submit.prevent="handleFormSubmit" class="flex-initial">
        <div class="my-3 py-3">
          <AppSelect v-model="newRole.role" label="New role" :items="roleOptions" />
        </div>

        <div>
          <div class="my-3 py-3">
            <AppLabel :label="inputT('starts.label')" required />
            <AppRadioGroup
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
              <AppInput v-model="newRole.dateExpires" type="time" required />
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
import AppDateInput from '../../../../components/forms/AppDateInput.vue';
import RoleEditorItem from '../../../../components/pages/admin/contacts/RoleEditorItem.vue';
import { GetMemberData, MemberRoleData } from '../../../../utils/api/api.interface';
import { updateRole } from '../../../../utils/api/member';
import { onBeforeMount, ref, reactive } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
    contact: GetMemberData;
  }>();

const { t, n } = useI18n();
const inputT = (key: string) => t('contacts.data.rolesCopy.' + key);

const loading = ref(false);
const formVisible = ref(false);
const newRole = reactive({
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

async function handleFormSubmit() {
  loading.value = true;
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
    loading.value = false;
    formVisible.value = false;
  }
}

onBeforeMount(async () => {
  loading.value = false;
});
</script>
