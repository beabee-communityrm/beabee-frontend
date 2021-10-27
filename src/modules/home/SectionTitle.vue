<template>
  <div class="flex h-8 items-center">
    <span class="heading-decoration" />
    <h2
      class="text-sm text-primary-40 font-semibold uppercase text-center px-3"
    >
      <slot />
    </h2>
    <span class="heading-decoration" />
  </div>
</template>

<style scoped>
.heading-decoration {
  @apply h-px flex-grow bg-primary-20;
}
</style>
