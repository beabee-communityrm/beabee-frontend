<template>
  <SectionTitle class="uppercase">{{
    t('homePage.quickActions')
  }}</SectionTitle>

  <ul class="list-disc pl-4 font-semibold underline space-y-2 mt-4">
    <!--<li>
      <router-link to="/profile/edit">
        {{ t('homePage.editProfile') }}
      </router-link>
    </li>-->
    <li>
      <router-link to="/callouts">
        {{ t('homePage.viewOpenCallouts') }}
      </router-link>
    </li>
    <li v-if="!generalContent.hideContribution">
      <router-link to="/profile/contribution">
        {{ t('homePage.manageYourContribution') }}
      </router-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import SectionTitle from './SectionTitle.vue';
import { useI18n } from 'vue-i18n';
import { generalContent } from '../../../store';

const { t } = useI18n();
</script>
