<template>
  <div>Here we will display the content of a comment</div>
</template>

<script lang="ts" setup>
import { CalloutResponseCommentData } from '../../utils/api/api.interface';

const props = defineProps<{
  comment: CalloutResponseCommentData;
}>();
</script>
