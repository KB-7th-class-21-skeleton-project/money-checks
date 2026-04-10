<script setup>
import axios from "axios";
import { onMounted, reactive, ref } from "vue";
import { defineEmits } from "vue";
import {
	SlidersHorizontal,
	Utensils,
	Coffee,
	Car,
	ShoppingBag,
	Shirt,
	House,
	ScanHeart,
	Ticket,
	Ellipsis,
	Dog,
	HandCoins,
	Wallet,
	Guitar,
	BanknoteArrowDown,
} from "lucide-vue-next";

const props = defineProps({
	selectedCategory: String,
	selectedDate: String,
});

const icon = [
	Utensils,
	Coffee,
	Car,
	ShoppingBag,
	Ticket,
	ScanHeart,
	Guitar,
	Wallet,
	HandCoins,
	BanknoteArrowDown,
	Ellipsis,
];
const emit = defineEmits(["change-category", "change-date"]);

const categories = reactive({ item: [] });

const onSelectCategory = (name) => {
	emit("change-category", name);
};

const onSelectDate = (date) => {
	emit("change-date", date);
};

const requestCategory = () => {
	const url = "http://localhost:3000/categories";
	return axios.get(url);
};

onMounted(async () => {
	const response = await requestCategory("out");
	categories.item = response.data;
});
</script>
<template>
	<div>
		<div class="filter-box d-flex gap-2 align-items-center">
			<span class="rounded px-1.5 py-1.5 d-flex gap-1"
				><SlidersHorizontal color="grey" /> 필터</span
			>
			<div style="background-color: grey; width: 2px; height: 1rem"></div>

			<div class="dropdown">
				<button class="filter-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
					{{
						selectedDate === "0" ? "기간" : selectedDate === "4" ? "오늘" : selectedDate + "개월"
					}}
				</button>
				<ul class="dropdown-menu shadow border-0 rounded-4 p-2">
					<li
						v-for="d in [
							{ n: '전체', v: '0' },
							{ n: '1개월', v: '1' },
							{ n: '2개월', v: '2' },
							{ n: '3개월', v: '3' },
							{ n: '오늘', v: '4' },
						]"
						:key="d.v"
					>
						<button
							class="dropdown-item d-flex justify-content-between align-items-center py-2 px-3"
							:class="{ 'active-item': selectedDate === d.v }"
							@click="onSelectDate(d.v)"
						>
							<span>{{ d.n }}</span>
						</button>
					</li>
				</ul>
			</div>

			<div class="dropdown">
				<button class="filter-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
					{{ selectedCategory === "0" ? "카테고리" : selectedCategory }}
				</button>
				<ul class="dropdown-menu shadow border-0 rounded-4 p-2">
					<li>
						<button class="dropdown-item py-2 px-3" @click="onSelectCategory('0')">
							<div class="d-flex align-items-center gap-2"><Dog :size="18" />전체</div>
						</button>
					</li>
					<li v-for="(c, index) in categories.item" :key="c.id">
						<button
							class="dropdown-item d-flex justify-content-between align-items-center py-3 px-3"
							:class="{ 'active-item': selectedCategory === c.name }"
							@click="onSelectCategory(c.name)"
						>
							<div class="d-flex align-items-center gap-2">
								<component :is="icon[index]" :size="18"></component>
								{{ c.name }}
							</div>
						</button>
					</li>
				</ul>
			</div>
		</div>
		<hr class="mt-2 mb-0" />
	</div>
</template>

<style scoped>
.filter-btn {
	background-color: none;
	border: none;
	font-size: 1rem;
	font-width: 700;
	color: #343a40;
	padding: 0.5rem;
}

.dropdown-item {
	border-radius: 8px;
	color: #adb5bd; /* 비활성 상태: 연한 회색 */
	font-weight: 500;
	transition: all 0.2s;
}

/* 마우스 올렸을 때 */
.dropdown-item:hover {
	background-color: #f8f9fa;
	color: #343a40;
}

/* 선택된 상태 스타일 (이미지처럼 진하게) */
.active-item {
	color: #343a40 !important;
	background-color: transparent !important;
}

/* 체크 아이콘 색상 */
.lucide-check {
	color: #343a40;
}

/* 모든 리스트 사이 구간 나누기 */
li:not(:last-child) {
	border-bottom: 1px solid #f1f3f5;
}
</style>
