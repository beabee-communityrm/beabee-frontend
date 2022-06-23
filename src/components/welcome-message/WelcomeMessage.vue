<template>
  <div class="bg-white rounded p-4 shadow relative" :class="!small && 'md:8'">
    <div class="flex" :class="!small && 'md:block'">
      <WelcomeIcon
        class="float-left mb-4 mr-4 w-[4.5rem] h-auto"
        :class="!small && 'md:w-[7.5rem] lg:w-[17rem] md:mb-8 md:mr-8'"
      />

      <AppSubHeading class="mb-3">
        {{ t('homePage.welcome', { firstName }) }}
      </AppSubHeading>
    </div>

    <div
      class="content-message text-sm leading-5 mb-6 whitespace-normal"
      :class="!small && 'md:text-base md:leading-5.5 lg:text-lg lg:leading-6'"
      v-html="text"
    />

    <div class="clear-left" />

    <FontAwesomeIcon
      class="text-2xl absolute top-4 right-4 cursor-pointer"
      :icon="['fas', 'times']"
      @click="$emit('close')"
    />
  </div>
</template>

<script lang="ts" setup>
import WelcomeIcon from './WelcomeIcon.vue';
import { useI18n } from 'vue-i18n';
import AppSubHeading from '../AppSubHeading.vue';

const { t } = useI18n();

defineProps<{
  firstName: string;
  text: string;
  small?: boolean;
}>();

defineEmits(['close']);
</script>
