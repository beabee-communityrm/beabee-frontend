<template>
  <PageTitle :title="t('contacts.addContact')"></PageTitle>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import PageTitle from '../../../components/PageTitle.vue';

const { t } = useI18n();
</script>
