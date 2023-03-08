<template>
  <AppDropdownButton
    icon="folder"
    variant="primaryOutlined"
    :title="t('calloutResponse.data.bucket')"
  >
    <slot />

    <template #dropdown>
      <ul>
        <li
          v-for="bucket in buckets"
          :key="bucket.id"
          class="py-2 px-3 hover:bg-primary-5"
          :class="{ hidden: bucket.id === currentBucket }"
          @click="$emit('move', bucket.id)"
        >
          {{
            t('calloutResponsesPage.moveToBucket', {
              bucket: bucket.label,
            })
          }}
        </li>
      </ul>
    </template>
  </AppDropdownButton>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppDropdownButton from '../../../button/AppDropdownButton.vue';

defineEmits<{ (event: 'move', id: string): void }>();
defineProps<{ currentBucket: string; small?: boolean }>();

const { t } = useI18n();

const buckets = computed(() => [
  { id: '', label: t('calloutResponseBuckets.inbox') },
  {
    id: 'verified',
    label: t('calloutResponseBuckets.verified'),
  },
  {
    id: 'trash',
    label: t('calloutResponseBuckets.trash'),
  },
]);
</script>
