<template>
  <div class="mx-auto px-4">
    <div
      class="
        bg-white
        text-primary
        py-6
        md:py-12
        px-5
        md:px-12
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
  max-width: 32rem;
}
</style>
