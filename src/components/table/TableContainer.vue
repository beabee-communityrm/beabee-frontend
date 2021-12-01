<template>
  <table class="font-semibold">
    <thead class="text-sm border-b border-primary-20">
      <tr>
        <th
          v-for="(item, index) in headers"
          :key="index"
          class="pb-2"
          align="left"
          :style="{ width: item.width }"
        >
          {{ item.text }}
        </th>
      </tr>
    </thead>

    <tbody class="text-xs">
      <tr
        v-for="(item, i) in items"
        :key="i"
        class="border-b border-primary-20"
      >
        <td v-for="(value, key, j) in item" :key="j" class="py-2 align-top">
          <slot :name="key" :item="item">{{ value }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
// custom tabelcell:
// `email` should be replaced with the object property name of item
//     <template #email="{ item }">
//      <span class="text-secondary">{{ item.email }}</span>
//    </template>

defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
