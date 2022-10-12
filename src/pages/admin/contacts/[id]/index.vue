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
          :name="t('contacts.data.contributionType')"
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

      <form @submit.prevent="handleFormSubmit">
        <AppInput
          v-model="contactAnnotations.description"
          :label="t('contacts.data.description')"
          class="mb-4"
        />
        <RichTextEditor
          v-model="contactAnnotations.notes"
          :label="t('contacts.data.notes')"
          class="mb-4"
        />
        <TagDropdown
          v-if="contactTags.length > 0"
          v-model="contactAnnotations.tags"
          :tags="contactTags"
          label="Tags"
        />
        <AppButton
          type="submit"
          variant="primary"
          class="mt-4"
          :loading="noteFormLoading"
          >{{ t('form.saveChanges') }}</AppButton
        >
      </form>
      <MessageBox v-if="hasSetAnnotations" type="success" class="mt-5">
        {{ t('contacts.data.annotationsCopy') }}
      </MessageBox>
    </div>

    <div>
      <AppHeading>{{ t('contactOverview.roles') }}</AppHeading>
      <div v-for="role in contact.roles" :key="role.role">
        <div
          class="mt-4 flex items-center rounded border border-primary-20 px-2.5 py-1"
        >
          <AppRoundBadge
            :type="isRoleCurrent(role) ? 'success' : 'danger'"
            class="mx-2"
          />
          <strong class="mx-2 text-sm font-bold uppercase">
            {{ t(`common.role.${role.role}`) }}
          </strong>
          {{ formatLocale(role.dateAdded, 'P') + ' → ' }}
          {{
            role.dateExpires
              ? formatLocale(role.dateExpires, 'P')
              : t('contacts.data.rolesCopy.today')
          }}
          <div class="ml-auto">
            <AppButton variant="text" size="sm" @click="openEditRoleForm(role)"
              >Edit</AppButton
            >
            <AppButton variant="dangerText" size="sm" @click="handleDeleteRole">
              Delete role
            </AppButton>
          </div>
        </div>
        <div>
          <AppButton
            variant="primaryOutlined"
            @click="newRoleFormVisible = true"
            class="w-full !bg-primary-5"
            >Add role</AppButton
          >
        </div>
      </div>
    </div>

    <RoleEdit ref="newRoleForm" type="new" :visible="newRoleFormVisible" />

    <div class="hidden">
      <AppHeading>{{ t('contactOverview.security.title') }}</AppHeading>
      <p>{{ t('contactOverview.security.whatDoTheButtonsDo') }}</p>
      <form @submit.prevent="handleSecurityAction">
        <AppButton
          type="submit"
          variant="primaryOutlined"
          :disabled="securityButtonsDisabled"
          :loading="noteFormLoading"
          class="mt-2"
          >{{ t('contactOverview.security.loginOverride') }}</AppButton
        >
        <AppButton
          type="submit"
          variant="primaryOutlined"
          :disabled="securityButtonsDisabled"
          :loading="noteFormLoading"
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
import AppHeading from '../../../../components/AppHeading.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppLabel from '../../../../components/forms/AppLabel.vue';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import AppTextArea from '../../../../components/forms/AppTextArea.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';
import AppDateInput from '../../../../components/forms/AppDateInput.vue';
import AppRoundBadge from '../../../../components/AppRoundBadge.vue';
import TagDropdown from '../../../../components/pages/admin/contacts/TagDropdown.vue';
import RoleEdit from '../../../../components/pages/admin/contacts/RoleEdit.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import { onBeforeMount, ref, reactive } from 'vue';
import { ContributionType } from '../../../../utils/enums/contribution-type.enum';
import {
  GetMemberData,
  GetMemberDataWith,
  MemberRoleData,
} from '../../../../utils/api/api.interface';
import {
  fetchMember,
  updateMember,
  addMemberRole,
  updateRole,
  deleteRole,
} from '../../../../utils/api/member';
import AppInfoList from '../../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../../utils/dates/locale-date-formats';
import { fetchContent } from '../../../../utils/api/content';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';

formatLocale;

const { t, n } = useI18n();
const inputT = (key: string) => t('contacts.data.rolesCopy.' + key);

const props = defineProps<{
  contact: GetMemberData;
}>();

const contact = ref<GetMemberDataWith<
  'profile' | 'contribution' | 'roles'
> | null>(null);
const contactTags = ref<string[]>([]);
const noteFormLoading = ref(false);
const hasSetAnnotations = ref(false);
const securityButtonsDisabled = ref(false);
const contactAnnotations = reactive({
  notes: '',
  description: '',
  tags: [] as string[],
});
const securityLink = ref('');
const newRoleFormVisible = ref(false);

async function handleFormSubmit() {
  noteFormLoading.value = true;
  try {
    await updateMember(props.contact.id, {
      profile: { ...contactAnnotations },
    });
  } finally {
    noteFormLoading.value = false;
    hasSetAnnotations.value = true;
  }
}

async function handleDeleteRole(role) {
  try {
    await deleteRole(props.contact.id, editRole.role);
  } finally {
    editRoleFormLoading.value = false;
    isEditRoleFormVisible.value = false;
  }
}

async function handleSecurityAction() {
  securityButtonsDisabled.value = true;
  noteFormLoading.value = true;
  try {
    const response = await (() => 'https://reset-link.com')();
    securityLink.value = response;
  } finally {
    noteFormLoading.value = false;
  }
}

function isRoleCurrent(role: MemberRoleData): boolean {
  const now = new Date();
  return role.dateAdded < now && (!role.dateExpires || role.dateExpires > now);
}

onBeforeMount(async () => {
  noteFormLoading.value = false;
  newRoleFormVisible.value = false;
  securityButtonsDisabled.value = false;

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
