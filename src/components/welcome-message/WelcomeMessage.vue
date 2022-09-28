<template>
  <div class="bg-white rounded p-4 shadow relative" :class="!small && 'lg:p-8'">
    <div>
      <WelcomeIcon
        class="float-left mb-4 mr-4 w-[4.5rem] h-auto md:w-[7.5rem]"
        :class="!small && 'lg:w-[17rem] lg:mb-8 lg:mr-8'"
      />

      <AppSubHeading class="mb-4">
        {{ t('homePage.welcome', { firstName, lastName }) }}
      </AppSubHeading>
    </div>

    <div
      class="content-message text-sm leading-5 whitespace-normal md:text-base md:leading-5.5"
      :class="!small && 'lg:leading-6'"
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
  lastName: string;
  text: string;
  small?: boolean;
}>();

defineEmits(['close']);
</script>
