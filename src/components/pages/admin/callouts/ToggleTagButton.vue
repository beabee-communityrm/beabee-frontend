<template>
  <AppDropdownButton
    :icon="faTag"
    variant="primaryOutlined"
    :title="t('calloutResponsePage.actions.toggleTag')"
  >
    <span v-if="withText">
      {{ t('calloutResponsePage.actions.toggleTag') }}
    </span>

    <template #dropdown>
      <p v-if="tagItems.length === 0" class="py-2 px-3 italic">
        {{ t('calloutResponsesPage.noTags') }}
      </p>
      <AppSelectableList
        v-else
        v-slot="{ item }"
        :items="tagItems"
        :selected-item-ids="selectedTags"
        @click="
          (item, selected) => $emit('toggle', (selected ? '-' : '+') + item.id)
        "
      >
        <font-awesome-icon class="mr-2" :icon="faTag" />{{ item.label }}
      </AppSelectableList>

      <router-link
        class="block border-t border-primary-40 py-2 px-3 font-semibold text-primary underline hover:bg-primary-5 group-hover:border-primary"
        :to="manageUrl"
      >
        <font-awesome-icon class="mr-2" :icon="faCog" />{{
          t('calloutResponsePage.manageTags')
        }}
      </router-link>
    </template>
  </AppDropdownButton>
</template>
<script lang="ts" setup>
import { faCog, faTag } from '@fortawesome/free-solid-svg-icons';
import { useI18n } from 'vue-i18n';
import AppSelectableList from '../../../AppSelectableList.vue';
import AppDropdownButton from '../../../button/AppDropdownButton.vue';

defineEmits<{ (event: 'toggle', id: string): void }>();
defineProps<{
  tagItems: { id: string; label: string }[];
  selectedTags: string[];
  manageUrl: string;
  withText?: boolean;
}>();

const { t } = useI18n();
</script>
