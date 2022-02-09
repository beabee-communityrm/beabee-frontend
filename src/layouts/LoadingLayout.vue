<template>
  <main class="auth min-h-screen bg-fixed bg-cover bg-center py-4">
    <AuthBox class="text-center">
      <img
        class="w-28 inline-block mb-5"
        src="../assets/images/logo.png"
        :alt="generalContent.organisationName"
      />
      <h1 class="text-2.5xl mb-5">Loading...</h1>

      <font-awesome-icon
        :style="{ fontSize: '60px' }"
        :icon="['fas', 'circle-notch']"
        spin
      />

      <router-view />
    </AuthBox>
  </main>
</template>

<script lang="ts" setup>
import AuthBox from '../modules/auth/AuthBox.vue';
import { generalContent } from '../store';
</script>

<style scoped>
.auth {
  background-image: url('../assets/images/auth-bg.jpg');
}
</style>
