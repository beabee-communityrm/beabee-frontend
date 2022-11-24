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
  <div class="flex gap-8">
    <div class="flex-0 basis-menu">
      <!-- <AppTabs v-model="selectedStepIndex" :steps="steps" /> -->
      <AppTabs :items="tabs" :selected="route.name ? route.name as string : null" /> -->
      
    </div>
  </div>
</template>
<script lang="ts" setup>
import mitt from 'mitt';
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../../components/PageTitle.vue';
import AppTabs from '../../../components/tabs/AppTabs.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { MembershipBuilderEmitter } from '../../../components/pages/admin/membership-builder/membership-builder.interface';
import useVuelidate from '@vuelidate/core';
import { TabItem } from '../../../components/tabs/tabs.interface';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const updated = ref(false);
const updating = ref(false);
const dirty = ref(false);

// TODO: i18n
const tabs: Ref<TabItem[]> = ref([
  { id: 'joinForm',
    label: 'Join form',
    to: `/admin/membership-builder/join-form`,
  },
  { id: 'confirmation',
    label: 'Account confirmation',
    to: `/admin/membership-builder/confirmation`,
  },
  { id: 'introMessage',
    label: 'Intro message',
    to: `/admin/membership-builder/intro`,
  },
  { id: 'emails',
    label: 'Emails',
    to: `/admin/membership-builder/emails`,
  },

]);

const validation = useVuelidate();

const emitter: MembershipBuilderEmitter = mitt();

emitter.on('dirty', () => {
  dirty.value = true;
  updated.value = false;
});

async function handleUpdate() {
  function handleUpdated() {
    dirty.value = false;
    emitter.off('updated', handleUpdated);
    updated.value = true;
  }
  updating.value = true;

  emitter.emit('update');
  emitter.on('updated', handleUpdated);
}
</script>
