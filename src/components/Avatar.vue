<template>
	<div :class="cn(avatarVariants({ size }), $attrs.class)">
		<img
			v-if="src"
			:src="src"
			:alt="alt"
			class="aspect-square h-full w-full object-cover rounded-full"
		/>
		<div
			v-else
			class="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-700"
		>
			<span class="font-semibold" :class="textSizeClass">{{ fallbackText }}</span>
		</div>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
	"relative flex shrink-0 overflow-hidden rounded-full border border-gray-100",
	{
		variants: {
			size: {
				36: "h-9 w-9",
				48: "h-12 w-12",
				64: "h-16 w-16",
			},
		},
		defaultVariants: {
			size: 48,
		},
	},
);

const props = defineProps({
	src: {
		type: String,
		default: "",
	},
	alt: {
		type: String,
		default: "User avatar",
	},
	size: {
		type: [Number, String],
		default: 48,
	},
});

const fallbackText = computed(() => {
	return props.alt ? props.alt.slice(0, 1).toUpperCase() : "U";
});
const textSizeClass = computed(() => {
	const sizeMap = {
		36: "text-xs",
		48: "text-sm",
		64: "text-lg",
	};
	return sizeMap[props.size] || "text-sm";
});
</script>
