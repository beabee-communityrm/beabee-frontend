<template>
	<label v-if="label" class="block mb-1.5 font-semibold">{{ label }}</label>

	<div class="flex flex-row h-[3rem]">
		<div
			v-for="tag in selectedTags"
			class="
				text-xs
				font-semibold
				inline-block
				py-1
				px-2
				uppercase
				rounded
				bg-white
				uppercase
				last:mr-0
				mr-1
				h-[1.5rem]
			"
		>
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
				<p @click="handleTagClick(tag)" class="">🏷 {{ tag.label }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';

const props = withDefaults(
	defineProps<{
		label?: string;
	}>(),
	{
		label: undefined,
	}
);

const isTagMenuVisible = ref(false);

const selectedTags = ref([]);
const availableTags = ref([
	{ id: 1, label: 'French' },
	{ id: 2, label: 'Entrepreneur' },
	{ id: 3, label: 'Banana' },
]);

const handleTagClick = (tag) => {
	selectedTags.value = [...selectedTags.value, tag];
	availableTags.value = [...availableTags.value.filter((e) => e.id != tag.id)];
};
</script>
