<template>
	<div class="toggle-wrapper" @click="toggle">
		<span class="label">{{ modelValue ? "공개" : "비공개" }}</span>
		<div class="toggle-bg" :class="{ active: modelValue }">
			<div class="toggle-handle" :class="{ active: modelValue }"></div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const toggle = () => {
	emit("update:modelValue", !props.modelValue);
};
</script>

<style scoped>
.toggle-wrapper {
	display: flex;
	align-items: center;
	gap: 8px;
	cursor: pointer;
	user-select: none;
}
.label {
	font-size: 14px;
	color: #adb5bd;
}
.toggle-bg {
	width: 44px;
	height: 22px;
	background-color: #e9ecef;
	border-radius: 20px;
	position: relative;
	transition: background-color 0.2s;
}
.toggle-bg.active {
	background-color: #ffcc00; /* 노란색 배경 */
}
.toggle-handle {
	width: 18px;
	height: 18px;
	background-color: #fff;
	border-radius: 50%;
	position: absolute;
	top: 2px;
	left: 2px;
	transition: transform 0.2s;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.toggle-handle.active {
	transform: translateX(22px);
}
</style>
