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

    <AppButton variant="dangerOutlined" to="/contribution/cancel">
      {{ t('contribution.cancelContribution') }}
    </AppButton>
  </div>
</template>

<script lang="ts" setup>
import AppButton from '../../../components/forms/AppButton.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { parseISO } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  cancellationDate: {
    type: String as () => null | string,
    default: '',
  },
});

const formattedDate = computed(() => {
  if (!props.cancellationDate) return {};
  const parsedDate = parseISO(props.cancellationDate);
  return {
    day: formatLocale(parsedDate, 'do'),
    month: formatLocale(parsedDate, 'LLLL'),
  };
});
</script>
