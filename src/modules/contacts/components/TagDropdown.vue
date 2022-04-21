<template>
	<label v-if="label" class="block mb-1.5 font-semibold">{{ label }}</label>

	<div class="flex flex-row h-[3rem]">
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

	<div
		@click="isTagMenuVisible = !isTagMenuVisible"
		class="cursor-pointer w-full bg-white"
		:class="isTagMenuVisible ? 'h-[100px]' : 'h-[30px]'"
	>
		<div :class="isTagMenuVisible ? 'block' : 'hidden'">
			<div v-for="tag in availableTags">
				<p @click="handleAddTag(tag)" class="">🏷 {{ tag.label }}</p>
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
