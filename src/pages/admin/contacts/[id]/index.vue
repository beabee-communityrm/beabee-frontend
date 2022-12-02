<route lang="yaml">
name: adminContactsViewOverview
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <div v-if="contact" class="grid gap-8 lg:grid-cols-2">
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
            contact.lastSeen ? formatLocale(contact.lastSeen, 'PPP') : '–'
          "
        />
      </AppInfoList>
    </div>
    <div>
      <AppHeading>{{ t('contactOverview.information') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem
          :name="t('contacts.data.preferredChannel')"
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
          :name="t('contactOverview.newsletter')"
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
              : '–'
          "
        />
        <AppInfoListItem
          :name="t('contacts.data.period')"
          :value="contact.contributionPeriod"
        />
        <AppInfoListItem
          v-if="contact.contribution.type === ContributionType.Automatic"
          :name="t('contacts.data.payingFee')"
          :value="
            contact.contribution.payFee ? t('common.yes') : t('common.no')
          "
        />
        <AppInfoListItem
          :name="t('contactOverview.contributionType')"
          :value="contact.contribution.type"
        />
      </AppInfoList>
    </div>
    <div class="row-span-3 max-w-xl">
      <AppHeading>{{ t('contactOverview.about') }}</AppHeading>
      <div
        class="mb-5 text-sm text-body-80"
        v-html="t('contactOverview.annotation.copy')"
      />

      <AppForm
        :button-text="t('form.saveChanges')"
        :success-text="t('contacts.data.annotationsCopy')"
        @submit.prevent="handleFormSubmit"
      >
        <div class="mb-4">
          <AppInput
            v-model="contactAnnotations.description"
            :label="t('contacts.data.description')"
          />
        </div>
        <RichTextEditor
          v-model="contactAnnotations.notes"
          :label="t('contacts.data.notes')"
          class="mb-4"
        />
        <div class="mb-4">
          <TagDropdown
            v-if="contactTags.length > 0"
            v-model="contactAnnotations.tags"
            :tags="contactTags"
            label="Tags"
          />
        </div>
      </AppForm>
    </div>

    <div>
      <AppHeading>{{ t('contactOverview.roles') }}</AppHeading>
      <div class="relative">
        <RoleEditor
          :roles="contact.roles"
          class="mt-4"
          @delete="handleDeleteRole"
          @update="handleUpdateRole"
        />
        <div
          v-if="changingRoles"
          class="absolute inset-0 flex items-center justify-center bg-primary-5/50"
        >
          <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
        </div>
      </div>
    </div>

    <div class="hidden">
      <AppHeading>{{ t('contactOverview.security.title') }}</AppHeading>
      <p>{{ t('contactOverview.security.whatDoTheButtonsDo') }}</p>
      <form @submit.prevent="handleSecurityAction">
        <AppButton type="submit" variant="primaryOutlined" class="mt-4">{{
          t('contactOverview.security.loginOverride')
        }}</AppButton>
        <AppButton type="submit" variant="primaryOutlined" class="mt-2 ml-6">{{
          t('contactOverview.security.resetPassword')
        }}</AppButton>
      </form>
      <div v-if="securityLink" class="mt-4">
        <p class="mt-4">{{ t('contactOverview.security.instructions') }}</p>
        <AppInput readonly :value="securityLink" class="mt-2"></AppInput>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ContributionType, PermissionType } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../components/AppHeading.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import TagDropdown from '../../../../components/pages/admin/contacts/TagDropdown.vue';
import RoleEditor from '../../../../components/role/RoleEditor.vue';
import { onBeforeMount, ref, reactive } from 'vue';
import {
  GetMemberData,
  GetMemberDataWith,
  MemberRoleData,
} from '../../../../utils/api/api.interface';
import {
  deleteRole,
  fetchMember,
  updateMember,
  updateRole,
} from '../../../../utils/api/member';
import AppInfoList from '../../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../../utils/dates/locale-date-formats';
import { fetchContent } from '../../../../utils/api/content';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import AppForm from '../../../../components/forms/AppForm.vue';

const { t, n } = useI18n();

const props = defineProps<{
  contact: GetMemberData;
}>();

const contact = ref<GetMemberDataWith<
  'profile' | 'contribution' | 'roles'
> | null>(null);
const contactTags = ref<string[]>([]);
const contactAnnotations = reactive({
  notes: '',
  description: '',
  tags: [] as string[],
});
const securityLink = ref('');
const changingRoles = ref(false);

async function handleFormSubmit() {
  await updateMember(props.contact.id, {
    profile: { ...contactAnnotations },
  });
}

async function handleSecurityAction() {
  const response = await (() => 'https://reset-link.com')();
  securityLink.value = response;
}

async function handleUpdateRole(role: MemberRoleData) {
  await handleChangedRoles(() => updateRole(props.contact.id, role.role, role));
}

async function handleDeleteRole(roleName: PermissionType) {
  await handleChangedRoles(() => deleteRole(props.contact.id, roleName));
}

async function handleChangedRoles(cb: () => Promise<unknown>) {
  changingRoles.value = true;
  await cb();
  contact.value = await fetchMember(props.contact.id, [
    'profile',
    'contribution',
    'roles',
  ]);
  changingRoles.value = false;
}

onBeforeMount(async () => {
  contact.value = await fetchMember(props.contact.id, [
    'profile',
    'contribution',
    'roles',
  ]);
  contactAnnotations.notes = contact.value.profile.notes || '';
  contactAnnotations.description = contact.value.profile.description || '';
  contactAnnotations.tags = contact.value.profile.tags || [];

  contactTags.value = (await fetchContent('contacts')).tags;
});
</script>
