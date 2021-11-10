<template>
  <div
    class="bg-white rounded px-4 py-4 md:py-8 flex flex-col md:flex-row shadow"
  >
    <div class="flex items-center md:items-start">
      <WelcomeIcon class="icon" />

      <h3 class="title mb-2 md:hidden ml-4">
        {{ t('homePage.welocme', { name: memberFirstName }) }}
      </h3>
    </div>

    <div class="md:ml-8">
      <h3 class="title mibold mb-2 hidden md:block">
        {{ t('homePage.welocme', { name: memberFirstName }) }}
      </h3>

      <!-- - TODO: what kind of content is gonna be added here is it just <p> element? -->
      <div
        class="
          welcome-message-content
          text-sm
          md:text-lg
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

@media screen and (min-width: 768px) {
  .icon {
    width: 17rem;
    height: 19.125rem;
  }
}
</style>

/* not scoped because `p` is dynamic from the API */
<style>
.welcome-message-content p {
  margin-bottom: 30px;
}
</style>
