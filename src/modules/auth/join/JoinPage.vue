<template>
  <JoinForm
    :join-content="joinContent"
    :loading="loading"
    @submit.prevent="submitSignUp"
  />
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { JoinContent, SignupData } from '../../../utils/api/api.interface';
import { fetchContent } from '../../../utils/api/content';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { signUp } from '../../../utils/api/signup';
import JoinForm from './components/JoinForm.vue';

const router = useRouter();

const joinContent = ref<JoinContent>({
  initialAmount: 5,
  initialPeriod: ContributionPeriod.Monthly,
  minMonthlyAmount: 5,
  periods: [],
  showAbsorbFee: true,
  showNoContribution: false,
  subtitle: '',
  title: '',
});

const loading = ref(false);

async function submitSignUp(signUpData: SignupData) {
  loading.value = true;
  try {
    const data = await signUp(signUpData);
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
    } else {
      router.push({ path: '/join/confirm-email' });
    }
  } catch (err) {
    // Only revert loading on error as success causes route change
    loading.value = false;
    throw err;
  }
}

onBeforeMount(async () => {
  joinContent.value = await fetchContent('join');
});
</script>
