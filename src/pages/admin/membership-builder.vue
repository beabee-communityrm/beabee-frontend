<route lang="yaml">
name: adminMembershipBuilder
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <PageTitle :title="t('membershipBuilder.title')" />
  <AppStepper v-model="selectedStepIndex" :steps="steps" />
  <router-view />
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import { addBreadcrumb } from '../../store/breadcrumb';
import { faHandsHelping } from '@fortawesome/free-solid-svg-icons';
import AppStepper from '../../components/stepper/AppStepper.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const steps = ref([
  {
    id: 'adminMembershipBuilderJoinForm',
    name: t('membershipBuilder.steps.joinForm.title'),
    validated: true,
  },
  {
    id: 'adminMembershipBuilderAccountConfirmation',
    name: t('membershipBuilder.steps.accountConfirmation.title'),
    validated: true,
  },
  {
    id: 'adminMembershipBuilderIntroMessages',
    name: t('membershipBuilder.steps.intro.title'),
    validated: true,
  },
  {
    id: 'adminMembershipBuilderEmail',
    name: t('membershipBuilder.steps.emails.title'),
    validated: true,
  },
]);

const selectedStepIndex = computed({
  get: () => steps.value.findIndex((s) => s.id === route.name),
  set: (value) => {
    const step = steps.value[value];
    if (step) {
      router.push({ name: step.id });
    }
  },
});

addBreadcrumb(
  computed(() => [
    {
      title: t('membershipBuilder.title'),
      to: '/admin/membership-builder',
      icon: faHandsHelping,
    },
  ])
);
</script>
