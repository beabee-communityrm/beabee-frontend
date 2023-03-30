<template>
  <AppDropdownButton
    :icon="faFolder"
    variant="primaryOutlined"
    :title="t('calloutResponsePage.actions.moveBucket')"
  >
    <span v-if="withText">
      {{ t('calloutResponsePage.actions.moveBucket') }}
    </span>

    <template #dropdown>
      <AppSelectableList
        v-slot="{ item }"
        :items="selectableBuckets"
        @click="$emit('move', $event.id)"
      >
        {{
          t('calloutResponsesPage.moveToBucket', {
            bucket: item.label,
          })
        }}
      </AppSelectableList>
    </template>
  </AppDropdownButton>
</template>

<script lang="ts" setup>
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSelectableList from '../../../AppSelectableList.vue';
import AppDropdownButton from '../../../button/AppDropdownButton.vue';
import { buckets } from './callouts.interface';

defineEmits<{ (event: 'move', id: string): void }>();
const props = defineProps<{ currentBucket: string; withText?: boolean }>();

const { t } = useI18n();

const selectableBuckets = computed(() =>
  buckets.value.filter((b) => b.id !== props.currentBucket)
);
</script>
