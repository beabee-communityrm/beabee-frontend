<template>
  <AppDropdownButton
    icon="tag"
    variant="primaryOutlined"
    :title="t('calloutResponse.data.tags')"
  >
    <slot />

    <template #dropdown>
      <ul>
        <li
          v-for="tag in tagItemsWithSelected"
          :key="tag.id"
          class="flex items-center justify-between gap-4 py-2 px-3"
          :class="tag.selected ? 'bg-primary-10' : 'hover:bg-primary-5'"
          @click="$emit('toggle', (tag.selected ? '-' : '+') + tag.id)"
        >
          <span>
            <font-awesome-icon class="mr-2" :icon="['fa', 'tag']" />{{
              tag.label
            }}
          </span>
          <font-awesome-icon v-if="tag.selected" :icon="['fa', 'check']" />
        </li>
      </ul>
      <router-link
        class="block border-t border-primary-40 py-2 px-3 font-semibold text-primary underline hover:bg-primary-5 group-hover:border-primary"
        :to="manageUrl"
      >
        <font-awesome-icon class="mr-2" :icon="['fa', 'cog']" />{{
          t('calloutResponsePage.manageTags')
        }}
      </router-link>
    </template>
  </AppDropdownButton>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppDropdownButton from '../../../button/AppDropdownButton.vue';

defineEmits<{ (event: 'toggle', id: string): void }>();
const props = defineProps<{
  tagItems: { id: string; label: string }[];
  selectedTags: string[];
  manageUrl: string;
}>();

const tagItemsWithSelected = computed(() =>
  props.tagItems.map((tagItem) => ({
    ...tagItem,
    selected: props.selectedTags.includes(tagItem.id),
  }))
);

const { t } = useI18n();
</script>
