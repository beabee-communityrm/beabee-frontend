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

      <h3 class="title md:hidden ml-4">
        {{ t('homePage.welcome', { firstName: memberFirstName }) }}
      </h3>
    </div>

    <div class="md:ml-4 lg:ml-8 flex-grow">
      <WelcomeIcon class="hidden md:block lg:hidden icon float-left mr-4" />

      <h3 class="title mb-2 hidden md:block">
        {{ t('homePage.welcome', { firstName: memberFirstName }) }}
      </h3>

      <!-- - TODO: what kind of content is gonna be added here is it just <p> element? -->
      <div
        class="
          welcome-message-content
          text-sm
          md:text-base
          lg:text-lg
          mb-6
          whitespace-normal
        "
        v-html="text"
      />

      <div class="text-sm md:text-lg font-semibold leading-tight">
        {{ authorName }}
      </div>

      <div class="text-xs md:text-sm italic">
        {{ authorTitle }}
      </div>
    </div>

    <FontAwesomeIcon
      class="text-2xl absolute top-4 right-4 cursor-pointer"
      :icon="['fas', 'times']"
    />
  </div>
</template>

<script lang="ts" setup>
import WelcomeIcon from './WelcomeIcon.vue';
import { useI18n } from 'vue-i18n';

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
  authorName: {
    type: String,
    default: '',
  },
  authorTitle: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.title {
  @apply text-lg font-semibold;
}

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

/* not scoped because `p` is dynamic from the API */
<style>
.welcome-message-content p {
  @apply mb-4 leading-6;
}
</style>
