<route lang="yaml">
name: adminMembershipBuilderJoinForm
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <Suspense>
      <EditJoinForm />
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import EditJoinForm from '../../../components/pages/admin/membership-builder/steps/EditJoinForm.vue';

</script>
