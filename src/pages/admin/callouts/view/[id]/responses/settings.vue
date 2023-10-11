<route lang="yaml">
name: adminCalloutViewResponsesSettings
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <AppHeading class="mb-4">
        <font-awesome-icon :icon="faFolder" class="mr-2" />
        {{ t('calloutResponsePage.manageFolders') }}
      </AppHeading>

      <TagEditorItem
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        @update="(data) => handleUpdateTag(tag.id, data)"
        @delete="handleDeleteTag"
      />

      <div
        v-if="formVisible"
        class="rounded rounded-t-none border border-primary-20 bg-primary-10 p-4"
      >
        <AppSubHeading class="mb-4">
          {{ t('folderEditor.addNewFolder') }}
        </AppSubHeading>
        <TagEditorForm @cancel="formVisible = false" @save="handleNewTag" />
      </div>
      <AppButton
        v-else
        class="w-full"
        variant="primaryOutlined"
        @click="formVisible = true"
      >
        {{ t('folderEditor.add') }}
      </AppButton>
    </div>
    <div>
      <AppHeading class="mb-4">
        <font-awesome-icon :icon="faTag" class="mr-2" />
        {{ t('calloutResponsePage.manageTags') }}
      </AppHeading>

      <TagEditorItem
        v-for="tag in tags"
        :key="tag.id"
        :tag="tag"
        @update="(data) => handleUpdateTag(tag.id, data)"
        @delete="handleDeleteTag"
      />

      <div
        v-if="formVisible"
        class="rounded rounded-t-none border border-primary-20 bg-primary-10 p-4"
      >
        <AppSubHeading class="mb-4">
          {{ t('tagEditor.addNewTag') }}
        </AppSubHeading>
        <TagEditorForm @cancel="formVisible = false" @save="handleNewTag" />
      </div>
      <AppButton
        v-else
        class="w-full"
        variant="primaryOutlined"
        @click="formVisible = true"
      >
        {{ t('tagEditor.add') }}
      </AppButton>
    </div>
    <div>
      <AppHeading class="mb-4">
        <font-awesome-icon :icon="faUser" class="mr-2" />
        {{ t('calloutResponsePage.manageReviewers') }}
      </AppHeading>

      <ReviewerEditorItem
        v-for="reviewer in reviewers"
        :key="reviewer.reviewer"
        :reviewer="reviewer"
        @update="(data: any) => handleUpdateReviewer(reviewer.reviewer, data)"
        @delete="handleDeleteReviewer"
      />

      <div
        v-if="formVisible"
        class="rounded rounded-t-none border border-primary-20 bg-primary-10 p-4"
      >
        <AppSubHeading class="mb-4">
          {{ t('tagEditor.addNewReviewer') }}
        </AppSubHeading>
        <ReviewerEditorForm
          @cancel="formVisible = false"
          @save="handleNewReviewer"
        />
      </div>
      <AppButton
        v-else
        class="w-full"
        variant="primaryOutlined"
        @click="formVisible = true"
      >
        {{ t('reviewerEditor.add') }}
      </AppButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../../../components/AppHeading.vue';
import AppSubHeading from '../../../../../../components/AppSubHeading.vue';
import AppButton from '../../../../../../components/button/AppButton.vue';
import TagEditorForm from '../../../../../../components/tag/TagEditorForm.vue';
import TagEditorItem from '../../../../../../components/tag/TagEditorItem.vue';
import ReviewerEditorForm from '../../../../../../components/reviewer/ReviewerEditorForm.vue';
import ReviewerEditorItem from '../../../../../../components/reviewer/ReviewerEditorItem.vue';
import { addBreadcrumb } from '../../../../../../store/breadcrumb';
import { faTag, faFolder, faUser } from '@fortawesome/free-solid-svg-icons';
import {
  CreateCalloutReviewerData,
  CreateCalloutTagData,
  GetCalloutDataWith,
  GetCalloutReviewerData,
  GetCalloutTagData,
  UpdateCalloutReviewerData,
  UpdateCalloutTagData,
} from '../../../../../../utils/api/api.interface';

import {
  createReviewer,
  createTag,
  deleteReviewer,
  deleteTag,
  fetchReviewers,
  fetchTags,
  updateReviewer,
  updateTag,
} from '../../../../../../utils/api/callout';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();

const tags = ref<GetCalloutTagData[]>();
const reviewers = ref<GetCalloutReviewerData[]>();
const formVisible = ref(false);

addBreadcrumb(computed(() => [{ title: t('calloutResponsePage.manageTags') }]));

async function handleUpdateTag(tagId: string, data: UpdateCalloutTagData) {
  const updatedTag = await updateTag(props.callout.slug, tagId, data);
  tags.value = tags.value?.map((tag) => (tag.id === tagId ? updatedTag : tag));
}

async function handleDeleteTag(tagId: string) {
  await deleteTag(props.callout.slug, tagId);
  tags.value = tags.value?.filter((tag) => tag.id !== tagId);
}

async function handleNewTag(data: CreateCalloutTagData) {
  const tag = await createTag(props.callout.slug, data);
  tags.value?.push(tag);
  formVisible.value = false;
}

async function handleUpdateReviewer(
  reviewerId: string,
  data: UpdateCalloutReviewerData
) {
  const updatedReviewer = await updateReviewer(
    props.callout.slug,
    reviewerId,
    data
  );
  reviewers.value = reviewers.value?.map((reviewer) =>
    reviewer.reviewer === reviewerId ? updatedReviewer : reviewer
  );
}

async function handleDeleteReviewer(reviewerId: string) {
  await deleteReviewer(props.callout.slug, reviewerId);
  reviewers.value = reviewers.value?.filter(
    (reviewer) => reviewer.reviewer !== reviewerId
  );
}

async function handleNewReviewer(data: CreateCalloutReviewerData) {
  const reviewer = await createReviewer(props.callout.slug, data);
  reviewers.value?.push(reviewer);
  formVisible.value = false;
}

onBeforeMount(async () => {
  tags.value = await fetchTags(props.callout.slug);
  reviewers.value = await fetchReviewers(props.callout.slug);
});

onBeforeMount(async () => {
  tags.value = await fetchTags(props.callout.slug);
  reviewers.value = await fetchReviewers(props.callout.slug);
});
</script>
