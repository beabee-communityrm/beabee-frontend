<route lang="yaml">
name: adminMembershipBuilderEmail
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <div>
    <div class="mb-8 grid grid-cols-2 gap-8">
      <div>
        <p>{{ stepT('text') }}</p>
      </div>
    </div>

    <EmailEditor
      v-if="welcomeEmail !== undefined"
      :label="stepT('welcomeEmail')"
      :email="welcomeEmail"
      :footer="emailFooter"
    />

    <EmailEditor
      v-if="cancellationEmail !== undefined"
      :label="stepT('cancellationEmail')"
      :email="cancellationEmail"
      :footer="emailFooter"
    />
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import EmailEditor from '../../../components/pages/admin/membership-builder/EmailEditor.vue';
import { GetEmailData } from '../../../utils/api/api.interface';
import { fetchContent } from '../../../utils/api/content';
import { fetchEmail } from '../../../utils/api/email';
import { isRequestError } from '../../../utils/api';

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.emails.' + key);

const welcomeEmail = ref<GetEmailData | false>();
const cancellationEmail = ref<GetEmailData | false>();
const emailFooter = ref('');

async function loadEmail(id: string): Promise<GetEmailData | false> {
  try {
    return await fetchEmail(id);
  } catch (err) {
    if (isRequestError(err, 'external-email-template')) {
      return false;
    }
    return { body: '', subject: '' };
  }
}

onBeforeMount(async () => {
  welcomeEmail.value = await loadEmail('welcome');
  cancellationEmail.value = await loadEmail('cancelled-contribution');
  emailFooter.value = (await fetchContent('email')).footer;
});
</script>
