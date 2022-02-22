<template>
  <div v-if="contact" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
          :value="contact.profile.deliveryOptIn"
        />
        <AppInfoListItem
          :name="t('contacts.data.newsletter')"
          :value="contact.profile.newsletterStatus"
        />
        <AppInfoListItem
          :name="t('contacts.data.groups')"
          :value="contact.profile.newsletterGroups.join(',')"
        />
      </AppInfoList>
    </div>
  </div>

  <div v-if="contact" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
    <div>
      <AppHeading>{{ t('contactOverview.contribution') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem
          :name="t('contacts.data.amount')"
          :value="contact.contributionAmount"
        />
        <AppInfoListItem
          :name="t('contacts.data.period')"
          :value="contact.contributionPeriod"
        />
        <AppInfoListItem :name="t('contacts.data.payingFee')" :value="'xxx'" />
        <AppInfoListItem
          :name="t('contacts.data.contributionType')"
          :value="'xxx'"
        />
      </AppInfoList>
    </div>
    <div>
      <AppHeading>{{ t('contactOverview.about') }}</AppHeading>
      <p class="mb-5">
        All information added in this section is
        <b>visible for admins only.</b> Members will never see these in their
        profile or member area.
      </p>
      <form class="w-full max-w-lg">
        <div class="flex flex-wrap -mx-3 mb-1">
          <div class="w-full px-3">
            <label
              class="block tracking-wide text-gray-700 text-sm font-bold mb-2"
              for="grid-description"
            >
              Description
            </label>
            <input
              id="grid-description"
              class="
                appearance-none
                block
                w-full
                border border-gray-200
                rounded
                py-3
                px-4
                mb-3
                focus:outline-none focus:bg-white focus:border-gray-500
              "
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-3">
          <div class="w-full px-3">
            <label
              class="block tracking-wide text-gray-700 text-sm font-bold mb-2"
              for="grid-description"
            >
              Notes
            </label>
            <textarea
              id="grid-description"
              class="
                appearance-none
                block
                w-full
                border border-gray-200
                rounded
                py-3
                px-4
                mb-3
                focus:outline-none focus:bg-white focus:border-gray-500
              "
              type="textarea"
              placeholder=""
            />
          </div>
        </div>
        <div class="md:flex md:items-center">
          <div class="md:w-1/3">
            <button
              class="
                px-2
                text-center
                cursor-pointer
                inline-flex
                justify-center
                items-center
                font-bold
                rounded
                whitespace-nowrap
                relative
                h-10
                bg-link
                text-white
                opacity-60
                mb-4
                w-full
                hover:bg-link-20 hover:opacity-80
              "
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>

  <div v-if="contact" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
    <div>
      <AppHeading>{{ t('contactOverview.roles') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem :name="'Roles'" :value="'xxx or array'" />
        <AppInfoListItem :name="'Roles'" :value="'xxx or array'" />
      </AppInfoList>
    </div>
  </div>
  <div v-if="contact" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
    <AppHeading>{{ t('contactOverview.security') }}</AppHeading>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import { onBeforeMount, ref } from 'vue';
import {
  GetMemberData,
  GetMemberDataWithProfile,
} from '../../../utils/api/api.interface';
import { fetchMemberWithProfile } from '../../../utils/api/member';
import AppInfoList from '../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';

formatLocale;

const { t } = useI18n();

const props = defineProps<{
  contact: GetMemberData;
}>();

const contact = ref<GetMemberDataWithProfile | null>(null);

onBeforeMount(async () => {
  contact.value = await fetchMemberWithProfile(props.contact.id);
});
</script>
