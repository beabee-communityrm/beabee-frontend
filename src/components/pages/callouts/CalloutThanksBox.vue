<template>
  <div class="mb-6 flex rounded text-lg text-success">
    <div class="flex-0 mr-4 text-2xl">
      <font-awesome-icon :icon="faThumbsUp" />
    </div>
    <div>
      <h3 class="font-semibold">
        {{ callout.thanksTitle }}
      </h3>
      <div
        class="content-message font-normal text-body-80"
        v-html="callout.thanksText"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';

defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();
</script>
