<template>
  <div
    class="bg-white rounded px-4 py-4 md:py-8 flex flex-col md:flex-row shadow"
  >
    <div class="flex items-center md:items-start">
      <WelcomeIcon class="icon" />

      <h3 class="title mb-2 md:hidden ml-4">
        Welcome aboard {{ memberFirstName }}!
      </h3>
    </div>

    <div class="md:ml-8">
      <h3 class="title mibold mb-2 hidden md:block">
        Welcome aboard {{ memberFirstName }}!
      </h3>

      <!-- - TODO: what kind of content is gonna be added here is it just <p>?
      if yes we can just use space-y-5 for margin between paragraphs -->
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

// - TODO: replace placeholders with API response
defineProps({
  memberFirstName: {
    type: String,
    default: 'Luther',
  },
  text: {
    type: String,
    default:
      '<p>Journal Register hyperhyperlocal Frontline inverted pyramid I love the Weather & Opera section blog future, right-sizing dingbat tweets monetization open newsroom.</p><p>Like button Steve Jobs David Foster Wallace content is king tablets TechCrunch ProPublica newspaper strike commons-based peer production Marshall McLuhan going forward, fair use monetization Neil Postman right-sizing Aron Pilhofer Chartbeat inverted pyramid hyperhyperhyperlocal.</p><p>Paid content backpack journalist I love the news.me plagiarism pay curtain Romenesko Jeff Jarvis, Walter Cronkite died vast wasteland tweet reality-based news.me Demand Media linkbait David Cohn explainer.</p>',
  },
  authorName: {
    type: String,
    default: 'Anja Merkenich',
  },
  authorTitle: {
    type: String,
    default: 'haupt-editor',
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
