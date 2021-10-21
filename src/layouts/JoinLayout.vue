<template>
  <main class="join min-h-screen bg-grey-lighter md:bg-fixed md:bg-cover py-4">
    <router-view />
  </main>
</template>

<style scoped>
@media screen and (min-width: 768px) {
  .join {
    background-image: url('../assets/images/join-bg.jpg');
  }
}
</style>
