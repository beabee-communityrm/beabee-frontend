<template>
  <AppDropdownButton
    :icon="faUser"
    variant="primaryOutlined"
    :title="t('calloutResponsePage.actions.assignTo')"
  >
    <span v-if="withText">
      {{ t('calloutResponsePage.actions.assignTo') }}
    </span>

    <template #dropdown>
      <AppSelectableList
        v-slot="{ item }"
        :items="admins"
        :selected-item-ids="currentAssigneeId ? [currentAssigneeId] : []"
        @click="handleAssign"
      >
        {{ item.displayName }}
      </AppSelectableList>
    </template>
  </AppDropdownButton>
</template>

<script lang="ts" setup>
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { GetContactData } from '../../../../utils/api/api.interface';
import { fetchContacts } from '../../../../utils/api/contact';
import AppSelectableList from '../../../AppSelectableList.vue';
import AppDropdownButton from '../../../button/AppDropdownButton.vue';

const emit = defineEmits<{
  (event: 'assign', id: string | null, successText: string): void;
}>();
defineProps<{ currentAssigneeId?: string; withText?: boolean }>();

const { t } = useI18n();

const admins = ref<GetContactData[]>([]);

function handleAssign(item: unknown, selected: boolean) {
  const assignee = item as GetContactData;

  emit(
    'assign',
    selected ? null : assignee.id,
    t(
      selected
        ? 'calloutResponsePage.notifications.removedAssignee'
        : 'calloutResponsePage.notifications.addedAssignee',
      {
        assignee: assignee.displayName,
      }
    )
  );
}

onBeforeMount(async () => {
  // TODO: should paginate
  const results = await fetchContacts({
    rules: {
      condition: 'AND',
      rules: [
        { field: 'activePermission', operator: 'equal', value: ['admin'] },
      ],
    },
  });

  admins.value = results.items;
});
</script>
