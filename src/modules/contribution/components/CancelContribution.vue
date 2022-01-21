<template>
  <div>
    <p class="mb-3 text-sm">
      {{
        t('contribution.cancelDescription', {
          day: formattedDate.day,
          month: formattedDate.month,
        })
      }}
    </p>

    <AppButton
      class="w-full"
      variant="dangerOutlined"
      to="/profile/contribution/cancel"
    >
      {{ t('contribution.cancelContribution') }}
    </AppButton>
  </div>
</template>

<script lang="ts" setup>
import AppButton from '../../../components/forms/AppButton.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  expiryDate?: Date;
}>();

const formattedDate = computed(() => {
  return props.expiryDate
    ? {
        day: formatLocale(props.expiryDate, 'do'),
        month: formatLocale(props.expiryDate, 'LLLL'),
      }
    : {};
});
</script>
