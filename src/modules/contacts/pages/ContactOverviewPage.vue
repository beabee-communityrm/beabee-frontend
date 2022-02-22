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
        <AppInfoListItem :name="'Preferred channel'" :value="'-'" />
        <AppInfoListItem :name="t('contacts.data.email')" :value="'-'" />
        <AppInfoListItem :name="t('contacts.data.phone')" :value="'-'" />
        <AppInfoListItem
          :name="t('contacts.data.deliveryOptIn')"
          :value="'-'"
        />
        <AppInfoListItem :name="t('contacts.data.newsletter')" :value="'-'" />
        <AppInfoListItem :name="t('contacts.data.groups')" :value="'-'" />
      </AppInfoList>
    </div>
  </div>

  <div v-if="contact" class="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
    <div>
      <AppHeading>{{ t('contactOverview.contribution') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem :name="t('contacts.data.amount')" :value="'xxx'" />
        <AppInfoListItem :name="t('contacts.data.period')" :value="'xxx'" />
        <AppInfoListItem :name="t('contacts.data.payingFee')" :value="'xxx'" />
        <AppInfoListItem
          :name="t('contacts.data.contributionType')"
          :value="'xxx'"
        />
      </AppInfoList>
    </div>
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
