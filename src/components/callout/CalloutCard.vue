<template>
  <div
    class="callout-card group w-full cursor-pointer overflow-hidden rounded bg-white shadow md:max-w-[19rem]"
  >
    <router-link :to="`/callouts/${callout.slug}`" class="flex h-full flex-col">
      <div class="mb-2 h-36 bg-primary-40">
        <img
          v-if="callout.image"
          class="h-full w-full object-cover"
          :src="callout.image"
          :alt="callout.title"
        />
      </div>

      <div class="flex-grow px-4">
        <AppSubHeading class="my-2">{{ callout.title }}</AppSubHeading>

        <p class="mb-2 text-sm">{{ callout.excerpt }}</p>

        <div class="mb-3 flex items-end text-sm">
          <div v-if="callout.expires" class="ml-auto flex flex-col">
            <span class="font-semibold">{{
              `${t('common.until')} ${formattedExpiresDate}`
            }}</span>

            <span class="text-right text-body-80">{{
              `${t('common.timeIn', { time: expiresIn })}`
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="flex h-11 items-center bg-primary-10 px-5 text-primary-80 group-hover:bg-primary-20 group-hover:text-primary"
      >
        <span class="mary-80 ml-auto font-semibold">{{
          t('actions.participate')
        }}</span>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDistanceLocale } from '../../utils/dates';
import { GetCalloutData } from '../../utils/api/api.interface';
import AppSubHeading from '../AppSubHeading.vue';

const { t } = useI18n();

const props = defineProps<{
  callout: GetCalloutData;
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
