<template>
  <div
    class="
      bg-white
      rounded
      px-4
      py-4
      md:p-8
      flex flex-col
      md:flex-row
      shadow
      relative
    "
  >
    <div class="flex items-center md:items-start mb-2 md:mb-0">
      <WelcomeIcon class="icon md:hidden lg:block" />

      <AppSubHeading class="md:hidden ml-4">
        {{ t('homePage.welcome', { firstName }) }}
      </AppSubHeading>
    </div>

    <div class="lg:ml-8 flex-grow">
      <WelcomeIcon class="hidden md:block lg:hidden icon float-left mr-4" />

      <AppSubHeading class="mb-3 hidden md:block">
        {{ t('homePage.welcome', { firstName }) }}
      </AppSubHeading>

      <div
        class="
          content-message
          text-sm
          leading-5
          md:text-base md:leading-5.5
          lg:text-lg lg:leading-6
          mb-6
          whitespace-normal
        "
        v-html="text"
      />
    </div>

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

defineProps({
  memberFirstName: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
});

defineEmits(['close']);
</script>

<style scoped>
.icon {
  width: 4.5rem;
  height: 5rem;
}

@media screen and (min-width: 768px) and (max-width: 1023px) {
  .icon {
    width: 7.625rem;
    height: 8.625rem;
  }
}

@media screen and (min-width: 1024px) {
  .icon {
    width: 17rem;
    height: 19.125rem;
  }
}
</style>
