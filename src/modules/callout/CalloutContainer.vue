<template>
  <div v-if="callouts.length">
    <!-- small screens title -->
    <div class="flex md:hidden justify-center mb-8 relative">
      <span class="absolute w-full h-px bg-white top-1/2" />
      <h2
        class="
          text-sm
          bg-white
          text-link
          font-semibold
          h-8
          px-4.5
          flex
          items-center
          rounded
          z-10
          uppercase
        "
      >
        {{ t('homePage.newCallout') }}
      </h2>
    </div>

    <!-- big screens title -->
    <div class="hidden mb-2 items-center md:flex md:justify-between">
      <h2 class="text-lg font-bold">
        {{ t('homePage.openCallouts') }}
      </h2>

      <AppBadge class="uppercase">{{ t('common.new') }}</AppBadge>
    </div>

    <div class="mb-5 md:mb-7 flex justify-center">
      <!-- just show the first callout for now (design decision) -->
      <CalloutCard class="w-76" :callout="callouts[0]" />
    </div>

    <!-- hide because we don't have a page for all callouts yet
    <div class="text-center md:text-left">
      <router-link
        to="/callouts"
        class="
          md:text-lg
          underline
          text-primary-80
          font-semibold
          hover:text-primary
        "
        >{{ t('homePage.viewAllCallouts') }}</router-link
      >
    </div>
    -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core';
import CalloutCard from './CalloutCard.vue';
import { useCallout } from './use-callout';
import AppBadge from '../../components/AppBadge.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { setCallouts, callouts } = useCallout();

onMounted(setCallouts);
</script>
