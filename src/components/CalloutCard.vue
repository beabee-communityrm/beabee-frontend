<template>
  <div
    class="callout-card rounded overflow-hidden bg-white cursor-pointer shadow group w-full md:max-w-[19rem]"
  >
    <router-link :to="`/callouts/${callout.slug}`" class="flex flex-col h-full">
      <div class="bg-primary-40 mb-2 h-36">
        <img
          v-if="callout.image"
          class="object-cover h-full w-full"
          :src="callout.image"
          :alt="callout.title"
        />
      </div>

      <div class="px-4 flex-grow">
        <h3 class="font-title text-2xl leading-tight font-semibold mb-2">
          {{ callout.title }}
        </h3>

        <p class="text-sm leading-tight mb-2">{{ callout.excerpt }}</p>

        <div class="flex items-end text-sm mb-3">
          <div v-if="callout.expires" class="flex flex-col ml-auto">
            <span class="font-semibold">{{
              `${t('common.until')} ${formattedExpiresDate}`
            }}</span>

            <span class="text-body-80 text-right">{{
              `${t('common.timeIn', { time: expiresIn })}`
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-primary-10 text-primary-80 px-5 h-11 flex items-center group-hover:bg-primary-20 group-hover:text-primary"
      >
        <span class="mary-80 ml-auto font-semibold">{{
          t('common.participate')
        }}</span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { ref } from '@vue/reactivity';
import { onBeforeMount } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { formatDistanceLocale } from '../utils/dates/locale-date-formats';
import { GetBasicCalloutData } from '../utils/api/api.interface';

const { t } = useI18n();

const props = defineProps<{
  callout: GetBasicCalloutData;
}>();

const formattedExpiresDate = ref('');
const expiresIn = ref('');

const formatDate = () => {
  if (props.callout.expires) {
    formattedExpiresDate.value = `${format(
      props.callout.expires,
      'MMMM'
    )} ${format(props.callout.expires, 'd')}`;
    expiresIn.value = formatDistanceLocale(new Date(), props.callout.expires);
  }
};

onBeforeMount(() => {
  formatDate();
});
</script>
