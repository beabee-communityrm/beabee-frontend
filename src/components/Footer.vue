<template>
  <footer class="mt-8 divide-y">
    <div class="footer flex flex-row pt-4 border-t border-primary-40">
      <div class="w-1/5">
        <ul>
          <li>
            <a class="text-base font-semibold" :href="newsroomLink">{{
              newsroomName
            }}</a>
          </li>
          <li>&mdash;</li>
          <li>Contact us at</li>
          <li>
            <a :href="'mailto:' + newsroomEmail">{{ newsroomEmail }}</a>
          </li>
        </ul>
      </div>
      <div class="w-1/5 ml-4">
        <ul>
          <li><a href="#">Impressum</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms and Conditions</a></li>
        </ul>
      </div>
      <div class="w-1/5 ml-4">
        <ul>
          <li><a href="#">Memberships</a></li>
          <li><a href="#">Code of Conduct</a></li>
          <li><a href="#">FAQs</a></li>
          <li><a href="#">Contacts</a></li>
        </ul>
      </div>
      <div class="w-1/5 ml-auto">
        <ul v-if="canAdmin">
          <li><a class="font-bold" href="">beabee</a></li>
          <li><a href="">Join the community</a></li>
          <li><a href="">Handbook &amp; resources</a></li>
        </ul>
        <ul v-else>
          <li><a class="font-bold" href="">beabee</a></li>
          <li>powering independent local newsrooms</li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { canAdmin } from '../utils/currentUserCan';
const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;
const newsroomLink = import.meta.env.VITE_NEWSROOM_LINK;
const newsroomEmail = import.meta.env.VITE_NEWSROOM_EMAIL;
</script>

<style scoped>
.footer {
  @apply text-sm;
}

a {
  @apply text-link;
}
</style>
