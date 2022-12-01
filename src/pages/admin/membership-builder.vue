<route lang="yaml">
name: adminMembershipBuilder
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <PageTitle :title="t('membershipBuilder.title')" border>
    <div class="flex-0 ml-3">
      <span v-if="updated" class="mr-4 text-success">
        <font-awesome-icon :icon="['fa', 'check-circle']" />
        {{ t('form.updated') }}
      </span>
      <span v-else-if="validation.$invalid" class="mr-4 text-danger">
        <font-awesome-icon :icon="['fa', 'info-circle']" />
        {{ t('form.errors.aggregatorTop') }}
      </span>
      <span v-else-if="dirty" class="mr-4">
        <font-awesome-icon :icon="['fa', 'info-circle']" />
        {{ t('form.unsavedChanges') }}
      </span>
      <AppButton
        :loading="updating"
        :disabled="validation.$invalid"
        @click="handleUpdate"
        >{{ t('actions.update') }}</AppButton
      >
    </div>
  </PageTitle>

  <AppTabs :items="tabs" :selected="route.name ? route.name as string : null" />

  <router-view></router-view>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import AppTabs from '../../components/tabs/AppTabs.vue';
import AppButton from '../../components/forms/AppButton.vue';
import useVuelidate from '@vuelidate/core';
import { TabItem } from '../../components/tabs/tabs.interface';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const updated = ref(false);
const updating = ref(false);
const dirty = ref(false);

// TODO: i18n
const tabs: Ref<TabItem[]> = ref([
  {
    id: 'adminMembershipBuilderJoinForm',
    label: 'Join form',
    to: `/admin/membership-builder/join-form`,
  },
  {
    id: 'adminMembershipBuilderAccountConfirmation',
    label: 'Account confirmation',
    to: `/admin/membership-builder/confirmation`,
  },
  {
    id: 'adminMembershipBuilderIntroMessages',
    label: 'Intro messages',
    to: `/admin/membership-builder/intro`,
  },
  {
    id: 'adminMembershipBuilderEmail',
    label: 'Email notices',
    to: `/admin/membership-builder/email`,
  },
]);

const validation = useVuelidate();

async function handleUpdate() {
  updating.value = true;
  /*
  await updateContent('profile', {
    introMessage: showIntroMessage.value ? introMessage.value : '',
  });


  if (welcomeEmail.value) {
    await updateEmail('welcome', welcomeEmail.value);
  }
  if (cancellationEmail.value) {
    await updateEmail('cancelled-contribution', cancellationEmail.value);
  }
  

  if (joinContent.value) {
    await Promise.all([
      updateContent('join', joinContent.value),
      updateContent('general', {
        backgroundUrl: backgroundUrl.value || '',
      }),
    ]);
  }
  */
}
</script>
