<template>
  <dl class="grid gap-x-2 gap-y-1 items-baseline mt-2">
    <slot />
  </dl>
</template>

<style scoped>
dl {
  grid-template-columns: minmax(100px, 200px) 1fr;
}
</style>
