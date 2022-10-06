<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="content-message bg-white p-4 shadow" v-html="email" />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { currentUser } from '../../../../store';

const props = defineProps<{
  body: string;
  footer: string;
}>();

const email = computed(
  () =>
    props.body
      .replace('*|FNAME|*', currentUser.value?.firstname || '')
      .replace('*|LNAME|*', currentUser.value?.lastname || '') + props.footer
);
</script>
