<template>
  <div class="content-message shadow p-4 bg-white" v-html="email" />
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
    props.body.replace('*|FNAME|*', currentUser.value?.firstname || '') +
    props.footer
);
</script>
