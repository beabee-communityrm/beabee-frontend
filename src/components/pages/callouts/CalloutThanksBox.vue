<template>
  <AppMessageBox
    :title="callout.thanksTitle"
    :icon="faThumbsUp"
    variant="success"
  >
    <div
      class="content-message font-normal text-body-80"
      v-html="callout.thanksText"
    />
  </AppMessageBox>
</template>

<script lang="ts" setup>
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { GetCalloutDataWith } from '../../../utils/api/api.interface';
import AppMessageBox from '../../AppMessageBox.vue';

defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();
</script>
