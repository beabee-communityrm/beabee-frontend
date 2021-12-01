<template>
  <table>
    <thead>
      <tr>
        <th v-for="(item, index) in headers" :key="index" align="left">
          {{ item.text }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, i) in items" :key="i">
        <td v-for="(value, key, j) in item" :key="j">
          <slot :name="key" :item="item">{{ value }}</slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
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
