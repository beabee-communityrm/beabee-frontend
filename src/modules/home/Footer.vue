<template>
  <div class="footer flex flex-row pt-4 border-t border-primary-40">
    <div class="w-1/5">
      <ul>
        <li>
          <a class="text-link text-base font-semibold" :href="newsroomLink">{{
            newsroomName
          }}</a>
        </li>
        <li>&mdash;</li>
        <li>Contact us at</li>
        <li>
          <a class="text-link" :href="'mailto:' + newsroomEmail">{{
            newsroomEmail
          }}</a>
        </li>
      </ul>
    </div>
    <div class="w-1/5 ml-4">
      <ul>
        <li><a class="text-link" href="#">Impressum</a></li>
        <li><a class="text-link" href="#">Privacy Policy</a></li>
        <li><a class="text-link" href="#">Terms and Conditions</a></li>
      </ul>
    </div>
    <div class="w-1/5 ml-4">
      <ul>
        <li><a class="text-link" href="#">Memberships</a></li>
        <li><a class="text-link" href="#">Code of Conduct</a></li>
        <li><a class="text-link" href="#">FAQs</a></li>
        <li><a class="text-link" href="#">Contacts</a></li>
      </ul>
    </div>
    <div class="w-1/5 ml-auto">
      <ul>
        <li><a class="text-link font-bold" href="">beabee</a></li>
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
  @apply text-sm;
}
</style>
