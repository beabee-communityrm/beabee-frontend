<template>
  <div class="footer flex flex-row">
    <div class="flex-auto">
      <ul>
        <li>
          <a class="text-primary-80 font-bold" :href="newsroomLink">{{
            newsroomName
          }}</a>
        </li>
        <li>&mdash;</li>
        <li>Contact us at</li>
        <li>
          <a class="text-primary-80" :href="'mailto:' + newsroomEmail">{{
            newsroomEmail
          }}</a>
        </li>
      </ul>
    </div>
    <div class="flex-auto">
      <ul>
        <li><a class="text-primary-80" href="#">Impressum</a></li>
        <li><a class="text-primary-80" href="#">Privacy Policy</a></li>
        <li><a class="text-primary-80" href="#">Terms and Conditions</a></li>
      </ul>
    </div>
    <div class="flex-auto">
      <ul>
        <li><a class="text-primary-80" href="#">Memberships</a></li>
        <li><a class="text-primary-80" href="#">Code of Conduct</a></li>
        <li><a class="text-primary-80" href="#">FAQs</a></li>
        <li><a class="text-primary-80" href="#">Contacts</a></li>
      </ul>
    </div>
    <div class="flex-auto">
      <p></p>
    </div>
    <div class="flex-auto">
      <ul>
        <li><a class="text-primary-80" href="">beabee</a></li>
        <li>powering independent local newsrooms</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;
const newsroomLink = import.meta.env.VITE_NEWSROOM_LINK;
const newsroomEmail = import.meta.env.VITE_NEWSROOM_EMAIL;
</script>

<style scoped>
.footer {
  @apply text-xs;
}
</style>
