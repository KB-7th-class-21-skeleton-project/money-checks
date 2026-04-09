<template>
	<div class="header">
		<button class="btn-icon" @click="emit('back')">&#8249;</button>
		<span class="title">{{ title }}</span>
		<div class="menu-wrap">
			<button v-if="showMenu" class="btn-icon" @click="toggleMenu($event)">···</button>
			<div v-else class="btn-icon-placeholder" />
		</div>
	</div>

	<Teleport to="body">
		<div
			v-if="showMenu && isOpen"
			class="dropdown-fixed"
			:style="{ top: menuPos.top + 'px', right: menuPos.right + 'px' }"
		>
			<button @click="handleEdit">수정</button>
			<button class="danger" @click="handleDelete">삭제</button>
		</div>
	</Teleport>

	<div v-if="isOpen" class="overlay" @click="isOpen = false" />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
	title: String,
	showMenu: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["back", "edit", "delete"]);

const isOpen = ref(false);
const menuPos = ref({ top: 0, right: 0 });

function toggleMenu(event) {
	if (isOpen.value) {
		isOpen.value = false;
	} else {
		const rect = event.currentTarget.getBoundingClientRect();
		menuPos.value = {
			top: rect.bottom + 4,
			right: window.innerWidth - rect.right,
		};
		isOpen.value = true;
	}
}

function handleEdit() {
	isOpen.value = false;
	emit("edit");
}

function handleDelete() {
	isOpen.value = false;
	emit("delete");
}
</script>

<style scoped>
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16px 20px 12px;
	flex-shrink: 0;
}
.title {
	font-size: 17px;
	font-weight: 600;
	color: #111;
}
.btn-icon {
	background: none;
	border: none;
	cursor: pointer;
	font-size: 22px;
	color: #111;
	padding: 4px 8px;
	line-height: 1;
}
.btn-icon-placeholder {
	width: 40px;
}
.menu-wrap {
	position: relative;
}

.overlay {
	position: fixed;
	inset: 0;
	z-index: 99;
}

.dropdown-fixed {
	position: fixed;
	background: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 10px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	z-index: 200;
	overflow: hidden;
	min-width: fit-content;
}
.dropdown-fixed button {
	display: block;
	width: 100%;
	padding: 10px 20px;
	background: none;
	border: none;
	font-size: 14px;
	color: #111;
	cursor: pointer;
	text-align: left;
	white-space: nowrap;
}
.dropdown-fixed button:hover {
	background: #f5f5f5;
}
.dropdown-fixed button.danger {
	color: #e55;
}
.dropdown-fixed button.danger:hover {
	background: #fef0f0;
}
</style>
