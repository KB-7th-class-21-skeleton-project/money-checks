<template>
	<button :class="cn(buttonVariants({ variant, size }), $attrs.class)" v-bind="$attrs">
		<slot />
	</button>
</template>

<script setup>
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
	{
		variants: {
			variant: {
				default: "bg-primary text-gray-900 font-bold shadow hover:bg-[#E5BC00]",
				destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
				outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900",
				secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-300",
				ghost: "hover:bg-gray-100 hover:text-gray-900",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-12 rounded-md px-8 text-base",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

defineOptions({
	inheritAttrs: false,
});

defineProps({
	variant: {
		type: String,
		default: "default",
	},
	size: {
		type: String,
		default: "default",
	},
});
</script>
