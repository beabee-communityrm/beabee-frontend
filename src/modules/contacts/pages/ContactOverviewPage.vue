<template>
  <div v-if="contact" class="grid lg:grid-cols-2 gap-8">
    <div>
      <AppHeading>{{ t('contactOverview.overview') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem
          :name="t('contacts.data.joined')"
          :value="formatLocale(contact.joined, 'PPP')"
        />
        <AppInfoListItem
          :name="t('contacts.data.lastSeen')"
          :value="
            contact.lastSeen ? formatLocale(contact.lastSeen, 'PPP') : '-'
          "
        />
      </AppInfoList>
    </div>
    <div>
      <AppHeading>{{ t('contactOverview.information') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem
          :name="'Preferred channel'"
          :value="contact.profile.preferredContact"
        />
        <AppInfoListItem
          :name="t('contacts.data.email')"
          :value="contact.email"
        />
        <AppInfoListItem
          :name="t('contacts.data.phone')"
          :value="contact.profile.telephone"
        />
        <AppInfoListItem
          :name="t('contacts.data.deliveryOptIn')"
          :value="
            contact.profile.deliveryOptIn ? t('common.yes') : t('common.no')
          "
        />
        <AppInfoListItem
          :name="t('contacts.data.newsletter')"
          :value="contact.profile.newsletterStatus"
        />
        <AppInfoListItem
          :name="t('contacts.data.groups')"
          :value="contact.profile.newsletterGroups.join(', ')"
        />
      </AppInfoList>
    </div>

    <div>
      <AppHeading>{{ t('contactOverview.contribution') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem
          :name="t('contacts.data.amount')"
          :value="
            contact.contributionAmount
              ? n(contact.contributionAmount, 'currency')
              : '-'
          "
        />
        <AppInfoListItem
          :name="t('contacts.data.period')"
          :value="contact.contributionPeriod"
        />
        <AppInfoListItem
          v-if="contact.contribution.type === ContributionType.GoCardless"
          :name="t('contacts.data.payingFee')"
          :value="
            contact.contribution.payFee ? t('common.yes') : t('common.no')
          "
        />
        <AppInfoListItem
          :name="t('contacts.data.contributionType')"
          :value="contact.contribution.type"
        />
      </AppInfoList>
    </div>
    <div class="row-span-3 max-w-xl">
      <AppHeading>{{ t('contactOverview.about') }}</AppHeading>
      <p class="mb-5">
        {{ t('contactOverview.annotation.copy.begin') }}
        <b>{{ t('contactOverview.annotation.copy.bold') }}</b>
        {{ t('contactOverview.annotation.copy.end') }}
      </p>

      <form @submit.prevent="handleFormSubmit">
        <AppInput
          v-model="contactAnnotations.notes"
          input-type="text"
          :label="'Notes'"
          class="mb-4"
        />
        <AppTextArea
          v-model="contactAnnotations.description"
          input-type="text"
          :label="'Description'"
        />
        <AppButton
          type="submit"
          variant="link"
          class="mt-4"
          :loading="loading"
          >{{ t('form.saveChanges') }}</AppButton
        >
      </form>
    </div>

    <div>
      <AppHeading>{{ t('contactOverview.roles') }}</AppHeading>
      <AppInfoList v-for="role in contact.roles" :key="role.role">
        <AppInfoListItem :name="t(`common.role.${role.role}`)">
          <AppRoundBadge :type="isRoleCurrent(role) ? 'success' : 'warning'" />
          {{ formatLocale(role.dateAdded, 'P') + ' → ' }}
          {{
            role.dateExpires
              ? formatLocale(role.dateExpires, 'P')
              : t('contacts.data.rolesCopy.today')
          }}
        </AppInfoListItem>
      </AppInfoList>
    </div>
    <div>
      <AppHeading>{{ t('contactOverview.security.title') }}</AppHeading>
      <p>{{ t('contactOverview.security.whatDoTheButtonsDo') }}</p>
      <form @submit.prevent="handleSecurityAction">
        <AppButton
          type="submit"
          variant="link"
          :disabled="securityButtonsDisabled"
          :loading="loading"
          class="mt-2"
          >{{ t('contactOverview.security.loginOverride') }}</AppButton
        >
        <AppButton
          type="submit"
          variant="link"
          :disabled="securityButtonsDisabled"
          :loading="loading"
          class="mt-2 ml-6"
          >{{ t('contactOverview.security.resetPassword') }}</AppButton
        >
      </form>
      <div v-if="securityLink" class="mt-4">
        <p class="mt-4">{{ t('contactOverview.security.instructions') }}</p>
        <AppInput readonly :value="securityLink" class="mt-2"></AppInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import AppRoundBadge from '../../../components/AppRoundBadge.vue';
import { onBeforeMount, ref, reactive } from 'vue';
import { ContributionType } from '../../../utils/enums/contribution-type.enum';
import {
  GetMemberData,
  GetMemberDataWith,
  MemberRoleData,
} from '../../../utils/api/api.interface';
import { fetchMember, updateMember } from '../../../utils/api/member';
import AppInfoList from '../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';

formatLocale;

const { t, n } = useI18n();

const props = defineProps<{
  contact: GetMemberData;
}>();

const contact = ref<GetMemberDataWith<
  'profile' | 'contribution' | 'roles'
> | null>(null);
const loading = ref(false);
const securityButtonsDisabled = ref(false);
const contactAnnotations = reactive({ notes: '', description: '' });
const securityLink = ref('');

async function handleFormSubmit() {
  loading.value = true;
  try {
    await updateMember(props.contact.id, {
      profile: { tags: [], ...contactAnnotations },
    });
  } finally {
    loading.value = false;
  }
}

async function handleSecurityAction() {
  securityButtonsDisabled.value = true;
  loading.value = true;
  try {
    const response = await (() => 'https://reset-link.com')();
    securityLink.value = response;
  } finally {
    loading.value = false;
  }
}

const isRoleCurrent = (role: MemberRoleData): boolean => {
  const now = new Date();
  const roleWasAddedInThePast = role.dateAdded < now;
  const roleHasNoExpiryDate = !role.dateExpires;
  const roleExpiryDateInTheFuture = role.dateExpires
    ? role.dateExpires > now
    : false;
  return roleWasAddedInThePast &&
    (roleHasNoExpiryDate || roleExpiryDateInTheFuture)
    ? true
    : false;
};

onBeforeMount(async () => {
  contact.value = await fetchMember(props.contact.id, [
    'profile',
    'contribution',
    'roles',
  ]);
  loading.value = false;
  securityButtonsDisabled.value = false;
});
</script>
