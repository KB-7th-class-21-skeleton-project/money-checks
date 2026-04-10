<template>
	<transition name="fade">
		<div v-if="isOpen" class="sheet-overlay" @click="$emit('close')" />
	</transition>
	<transition name="slide-up">
		<div v-if="isOpen" class="category-sheet">
			<button class="close-btn" @click="$emit('close')">
				<X :size="24" color="#333" />
			</button>

			<p class="title">카테고리 선택</p>
			<div class="grid-layout">
				<button
					v-for="item in categories"
					:key="item.name"
					:class="['category-item', { active: selected === item.name }]"
					@click="$emit('select', item.name)"
				>
					<component :is="item.icon" :size="24" class="icon" />
					<span class="label">{{ item.name }}</span>
				</button>
			</div>
		</div>
	</transition>
</template>

<script setup>
import {
	Utensils,
	Coffee,
	Car,
	ShoppingBag,
	Shirt,
	Ticket,
	ScanHeart,
	Home,
	X,
} from "lucide-vue-next";

defineProps(["selected", "isOpen"]); //부모로부터 상태 전달받기
defineEmits(["select", "close"]);

const categories = [
	{ name: "식비", icon: Utensils },
	{ name: "카페", icon: Coffee },
	{ name: "교통", icon: Car },
	{ name: "생활", icon: ShoppingBag },
	{ name: "패션", icon: Shirt },
	{ name: "문화", icon: Ticket },
	{ name: "건강", icon: ScanHeart },
	{ name: "주거", icon: Home },
];
</script>

<style scoped>
.grid-layout {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 12px;
}

.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 0;
	border: 1px solid #eee;
	border-radius: 12px;
	background: #fff;
	cursor: pointer;
	transition: all 0.2s ease;
}

.category-item.active {
	border: 2px solid #ffd100;
	color: #ffd100;
	background-color: #fffef0;
}

.icon {
	margin-bottom: 6px;
}

.label {
	font-size: 13px;
	font-weight: 500;
	color: inherit;
}

.sheet-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 100;
}

.category-sheet {
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 100%;
	max-width: 480px;
	background: white;
	border-radius: 24px 24px 0 0;
	padding: 20px 24px 40px;
	z-index: 101;
	box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
}

.close-btn {
	position: absolute;
	top: 16px;
	right: 16px;
	background: none;
	border: none;
	cursor: pointer;
	padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 102;
}

.title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 20px;
	text-align: left;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
	transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateX(-50%) translateY(100%);
}
</style>
