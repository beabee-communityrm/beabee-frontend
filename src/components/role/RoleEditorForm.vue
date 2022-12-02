<template>
  <AppForm
    :button-text="t('actions.save')"
    :reset-button-text="t('actions.cancel')"
    @submit="handleSubmit"
    @reset="emit('cancel')"
  >
    <AppSelect
      v-if="!role"
      v-model="data.role"
      :label="t('roleEditor.new')"
      :items="roleOptions"
      required
      class="mb-4"
    />

    <div class="mb-4">
      <AppLabel :label="t('roleEditor.starts.label')" required />
      <AppRadioGroup
        v-if="!role"
        v-model="data.hasStartDate"
        :options="[
          [false, t('roleEditor.starts.opts.now')],
          [true, t('roleEditor.starts.opts.schedule')],
        ]"
        required
      />
      <div v-if="data.hasStartDate" class="flex gap-2">
        <div>
          <AppInput v-model="data.startDate" type="date" required />
        </div>
        <div>
          <AppInput v-model="data.startTime" type="time" required />
        </div>
      </div>
    </div>

    <div class="mb-4">
      <AppRadioGroup
        v-model="data.hasEndDate"
        :label="t('roleEditor.expires.label')"
        :options="[
          [false, t('roleEditor.expires.opts.never')],
          [true, t('roleEditor.expires.opts.schedule')],
        ]"
        required
      />
      <div v-if="data.hasEndDate" class="flex gap-2">
        <div>
          <AppInput v-model="data.endDate" type="date" required />
        </div>
        <div>
          <AppInput v-model="data.endTime" type="time" required />
        </div>
      </div>
    </div>
  </AppForm>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { MemberRoleData } from '../../utils/api/api.interface';
import AppForm from '../forms/AppForm.vue';
import AppInput from '../forms/AppInput.vue';
import AppLabel from '../forms/AppLabel.vue';
import AppRadioGroup from '../forms/AppRadioGroup.vue';
import AppSelect from '../forms/AppSelect.vue';

const { t } = useI18n();

const emit = defineEmits(['cancel', 'save']);
const props = defineProps<{
  role?: MemberRoleData;
  onSave?: (data: MemberRoleData) => Promise<void>;
}>();

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

const data = reactive({
  role: props.role?.role || ('' as const),
  ...(props.role
    ? {
        startDate: format(props.role.dateAdded, 'yyyy-MM-dd'),
        startTime: format(props.role.dateAdded, 'MM:mm'),
        hasStartDate: true,
      }
    : { startDate: '', startTime: '', hasStartDate: false }),
  ...(props.role?.dateExpires
    ? {
        endDate: format(props.role.dateExpires, 'yyyy-MM-dd'),
        endTime: format(props.role.dateExpires, 'MM:mm'),
        hasEndDate: true,
      }
    : { endDate: '', endTime: '', hasEndDate: false }),
});

async function handleSubmit() {
  if (!data.role) return; // Can't submit without a role

  if (props.onSave) {
    await props.onSave({
      role: data.role,
      dateAdded: data.hasStartDate
        ? new Date(data.startDate + 'T' + data.startTime)
        : new Date(),
      dateExpires: data.hasEndDate
        ? new Date(data.endDate + 'T' + data.endTime)
        : null,
    });
  }
}
</script>
