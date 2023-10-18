<template>
  <AppBoxout
    :title="callout.thanksTitle"
    :icon="faThumbsUp"
    class="mb-6"
    variant="success"
  >
    <div
      class="content-message font-normal text-body-80"
      v-html="callout.thanksText"
    />
  </AppBoxout>
</template>

<script lang="ts" setup>
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import AppBoxout from '../../AppBoxout.vue';

defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();
</script>
