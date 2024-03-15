<template>
  <div
    v-if="localeItems.length > 1"
    class="flex flex-wrap items-center rounded p-4"
  >
    <font-awesome-icon :icon="faGlobe" class="mr-2" />
    <AppToggle v-model="currentLocale" :items="localeItems" />
  </div>
</template>
<script lang="ts" setup>
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppToggle from '@components/forms/AppToggle.vue';
import { locales } from '@lib/i18n';
import { generalContent } from '@store/generalContent';

import type { GetCalloutDataWith } from '@type/get-callout-data-with';

const props = defineProps<{
  callout: GetCalloutDataWith<'variantNames'>;
}>();

const route = useRoute();
const router = useRouter();

const localeItems = computed(() =>
  props.callout.variantNames.map((name) => {
    const name2 = name === 'default' ? generalContent.value.locale : name;
    return {
      id: name === 'default' ? '' : name,
      label: locales.find((l) => l.id === name2)?.label || name2,
    };
  })
);

const currentLocale = computed({
  get: () => route.query.lang?.toString() || '',
  set: (value) => {
    router.push({
      query: { ...route.query, lang: value || undefined },
    });
  },
});
</script>
