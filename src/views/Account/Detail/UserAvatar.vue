<template>
	<div :class="['avatar', size]" :style="bgStyle">
		<img v-if="user?.profileUrl" :src="user.profileUrl" :alt="user.name" />
		<span v-else>{{ initials }}</span>
	</div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
	user: Object,
	size: { type: String, default: "md" }, // md | sm
});

const initials = computed(() => props.user?.name?.[0] ?? "?");

const COLORS = ["#e0d0f0", "#d0e8f0", "#f0e0d0", "#d0f0e0"];
const bgStyle = computed(() => ({
	background: props.user ? COLORS[props.user.id % COLORS.length] : "#eee",
}));
</script>

<style scoped>
.avatar {
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	overflow: hidden;
	font-size: 13px;
	font-weight: 500;
	color: #555;
}
.avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.md {
	width: 38px;
	height: 38px;
}
.sm {
	width: 32px;
	height: 32px;
	font-size: 12px;
}
</style>
