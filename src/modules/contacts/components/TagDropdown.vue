<template>
	<label v-if="label" class="block mb-1.5 font-semibold">{{ label }}</label>

	<div class="flex flex-col sm:flex-row">
		<div
			@click="isTagMenuVisible = !isTagMenuVisible"
			class="cursor-pointer align-middle w-full sm:w-1/2 bg-white p-2"
			:class="isTagMenuVisible ? 'h-auto' : ''"
		>
			<p class="align-middle">
				<font-awesome-icon
					class="inline-block cursor-pointer mr-2"
					icon="caret-down"
					@click="handleRemoveTag(tag)"
				/>
				Pick a tag from the list below:
			</p>
			<div
				:class="isTagMenuVisible ? 'block' : 'hidden'"
				class="divide-y divide-grey-100"
			>
				<div
					v-for="tag in availableTags"
					class="w-auto p-1 hover:bg-primary-20"
				>
					<p @click="handleAddTag(tag)" class="">🏷 {{ tag.label }}</p>
				</div>
			</div>
		</div>

		<div class="flex flex-row flex-wrap ml-0 sm:ml-4 mt-2 sm:mt-0">
			<div
				v-for="tag in assignedTags"
				class="
					text-xs
					font-semibold
					inline-block
					py-1
					px-2
					uppercase
					rounded
					bg-white
					last:mr-0
					mr-1
					h-[1.5rem]
					mb-2
				"
			>
				<font-awesome-icon
					class="inline-block cursor-pointer mr-2"
					icon="times"
					@click="handleRemoveTag(tag)"
				/>
				{{ tag.label }}
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import type { Ref } from 'vue';

const props = withDefaults(
	defineProps<{
		label?: string;
	}>(),
	{
		label: undefined,
	}
);
type Tag = { id: number; label: string };

const isTagMenuVisible = ref(false);

const assignedTags: Ref<Tag[]> = ref([]);
const availableTags: Ref<Tag[]> = ref([
	{ id: 1, label: 'French' },
	{ id: 2, label: 'Entrepreneur' },
	{ id: 3, label: 'Banana' },
]);

const handleAddTag = (tag: Tag) => {
	assignedTags.value = [...assignedTags.value, tag];
	availableTags.value = [...availableTags.value.filter((e) => e.id != tag.id)];
};
const handleRemoveTag = (tag: Tag) => {
	assignedTags.value = [...assignedTags.value.filter((e) => e.id != tag.id)];
	availableTags.value = [...availableTags.value, tag];
};
</script>
