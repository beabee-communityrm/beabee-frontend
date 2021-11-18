<template>
  <div
    class="rounded overflow-hidden bg-white cursor-pointer shadow callout-card"
  >
    <router-link :to="`/polls/${callout.slug}`">
      <div class="bg-primary-40 mb-2 h-36">
        <img
          v-if="callout.image"
          class="object-cover h-full w-full"
          :src="callout.image"
          :alt="callout.title"
        />
      </div>

      <div class="pl-4 pr-5">
        <h3 class="text-2xl font-semibold mb-1">{{ callout.title }}</h3>

        <p class="text-sm leading-tight">{{ callout.excerpt }}</p>

        <div class="flex items-end text-sm mb-3">
          <div v-if="callout.expires" class="flex flex-col ml-auto">
            <span class="font-semibold">{{
              `${t('common.until')} ${formattedExpiresDate}`
            }}</span>

            <span class="text-primary-70 text-right">{{
              `${t('common.in')}  ${expiresIn}`
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="
          bg-primary-10
          text-primary-80
          px-5
          h-11
          flex
          items-center
          participate
        "
      >
        <span class="mary-80 ml-auto font-semibold">{{
          t('common.participate')
        }}</span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { Callout } from './callout.interface';
import { format, parseISO } from 'date-fns';
import { ref } from '@vue/reactivity';
import { onBeforeMount } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { formatDistanceLocale } from '../../utils/dates/locale-date-formats';

const { t } = useI18n();

const props = defineProps({
  callout: {
    default: () => ({}),
    type: Object as () => Callout,
  },
});

const formattedExpiresDate = ref('');
const expiresIn = ref('');

const formatDate = () => {
  if (!props.callout.expires) return;

  const parsedDate = parseISO(props.callout.expires);

  formattedExpiresDate.value = `${format(parsedDate, 'MMMM')} ${format(
    parsedDate,
    'd'
  )}`;
  expiresIn.value = formatDistanceLocale(new Date(), parsedDate);
};

onBeforeMount(() => {
  formatDate();
});
</script>

<style scoped>
.callout-card:hover .participate {
  @apply bg-primary-20 text-primary;
}
</style>
