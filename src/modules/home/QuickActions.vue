<template>
  <SectionTitle>QUICK ACTIONS</SectionTitle>

  <ul class="list-disc pl-4 font-semibold underline space-y-2 mt-4">
    <li>
      <router-link to="/profile/edit">Edit your community profile</router-link>
    </li>
    <li>
      <router-link to="/callouts">View open callouts</router-link>
    </li>
    <li>
      <router-link to="/contributions">Manage your payments</router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import SectionTitle from './SectionTitle.vue';
</script>
