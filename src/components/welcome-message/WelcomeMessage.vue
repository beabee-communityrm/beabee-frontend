<template>
  <div class="bg-white rounded px-4 py-8 flex shadow">
    <div>
      <WelcomeIcon class="icon" />
    </div>
    <div class="ml-8">
      <h3 class="text-lg font-semibold mb-2">Welcome aboard {{ name }}!</h3>
      <!-- - TODO: what kind of content is gonna be added here is it just <p>?
      if yes we can just use space-y-5 for margin between paragraphs -->
      <div class="text-lg mb-6 space-y-5" v-html="text" />

      <div class="text-lg font-semibold leading-tight">
        {{ authorName }}
      </div>
      <div class="text-sm italic">
        {{ authorTitle }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import WelcomeIcon from './WelcomeIcon.vue';

// - TODO: replace placeholders with API response
defineProps({
  name: {
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
.icon {
  width: 17rem;
  height: 19.125rem;
}
</style>
