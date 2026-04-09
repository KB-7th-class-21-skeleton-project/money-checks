<template>
	<div class="category-container">
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
} from "lucide-vue-next";

defineProps(["selected"]);
defineEmits(["select"]);

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
.category-container {
	padding: 20px;
	background-color: #fff;
	border-top: 1px solid #eee;
}

.title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 16px;
	color: #333;
}

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

/* 선택되었을 때(active)의 스타일 */
.category-item.active {
	border: 2px solid #ffcc00;
	color: #ffcc00;
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
</style>
