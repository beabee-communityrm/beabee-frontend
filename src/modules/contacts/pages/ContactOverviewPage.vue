<template>
  <div>Your information</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import PageTitle from '../../../components/PageTitle.vue';
import { GetMemberData } from '../../../utils/api/api.interface';

const props = defineProps<{ member: GetMemberData }>();

const { t } = useI18n();
</script>
