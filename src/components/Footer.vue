<template>
  <footer class="mt-auto">
    <div
      class="
        text-sm
        xs:flex xs:flex-row xs:flex-wrap
        pt-4
        mt-8
        border-t border-primary-40
      "
    >
      <div class="w-full lg:w-auto mr-8 mb-6">
        <ul>
          <li>
            <a class="text-base font-semibold" :href="generalContent.siteUrl">{{
              generalContent.organisationName
            }}</a>
          </li>
          <li>&mdash;</li>
          <li>{{ t('footer.contactUs') }}</li>
          <li>
            <a :href="'mailto:' + generalContent.supportEmail">{{
              generalContent.supportEmail
            }}</a>
          </li>
        </ul>
      </div>
      <div class="mr-8 mb-6">
        <ul>
          <li>
            <a :href="generalContent.privacyLink">{{
              t('footer.privacyPolicy')
            }}</a>
          </li>
          <li v-if="generalContent.termsLink">
            <a :href="generalContent.termsLink">{{ t('footer.terms') }}</a>
          </li>
          <li v-if="generalContent.impressumLink">
            <a :href="generalContent.impressumLink">{{
              t('footer.impressum')
            }}</a>
          </li>
        </ul>
      </div>
      <div class="mr-8 mb-6">
        <ul>
          <li v-for="item in generalContent.footerLinks" :key="item.url">
            <a :href="item.url">{{ item.text }}</a>
          </li>
        </ul>
      </div>
      <div class="xs:w-1/5 xs:ml-auto mb-6">
        <ul>
          <li><a class="font-bold" href="https://beabee.io">beabee</a></li>
          <template v-if="canAdmin">
            <li>
              <a href="https://beabee.io/#Newsletter">{{
                t('footer.joinCommunity')
              }}</a>
            </li>
            <li class="hidden">
              <a href="">{{ t('footer.handbookResources') }}</a>
            </li>
          </template>
          <template v-else>
            <li>{{ t('footer.poweredBy') }}</li>
          </template>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { canAdmin } from '../utils/currentUserCan';
import { useI18n } from 'vue-i18n';
import { generalContent } from '../store';

const { t } = useI18n();
</script>

/* TODO: fix relying on scoped */
<style scoped>
a {
  @apply text-link;
}
</style>
