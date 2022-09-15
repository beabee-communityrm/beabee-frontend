<template>
  <div class="mx-auto px-4">
    <div
      class="
        bg-white
        py-6
        md:py-8
        px-6
        md:px-8
        mx-auto
        rounded-md
        auth-box
        mb-3
      "
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-box {
  box-shadow: 0 0 1rem 0.125rem rgba(51, 51, 51, 0.4);
  max-width: 30rem;
}
</style>
