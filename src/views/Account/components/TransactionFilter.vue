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
	<div class="filter-wrapper py-3 px-1">
		<div class="filter-box d-flex gap-3 align-items-center">
			<div class="filter-label d-flex align-items-center gap-2">
				<SlidersHorizontal :size="18" class="text-secondary" />
				<span class="label-text">필터</span>
			</div>

			<div class="divider"></div>

			<div class="dropdown">
				<button class="chip-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
					{{
						selectedDate === "0"
							? "전체 기간"
							: selectedDate === "4"
								? "오늘"
								: selectedDate + "개월"
					}}
				</button>
				<ul class="dropdown-menu custom-dropdown shadow-lg border-0 rounded-4 p-2">
					<li
						v-for="d in [
							{ n: '전체 기간', v: '0' },
							{ n: '1개월', v: '1' },
							{ n: '2개월', v: '2' },
							{ n: '3개월', v: '3' },
							{ n: '오늘', v: '4' },
						]"
						:key="d.v"
					>
						<button
							class="dropdown-item py-2 px-3"
							:class="{ 'active-item': selectedDate === d.v }"
							@click="onSelectDate(d.v)"
						>
							{{ d.n }}
						</button>
					</li>
				</ul>
			</div>

			<div class="dropdown">
				<button class="chip-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
					{{ selectedCategory === "0" ? "모든 카테고리" : selectedCategory }}
				</button>
				<ul class="dropdown-menu category-grid custom-dropdown shadow-lg border-0 rounded-4 p-2">
					<li class="grid-full">
						<button
							class="dropdown-item py-2 px-3"
							:class="{ 'active-item': selectedCategory === '0' }"
							@click="onSelectCategory('0')"
						>
							<div class="d-flex align-items-center gap-2"><Dog :size="16" /> 전체</div>
						</button>
					</li>
					<li v-for="(c, index) in categories.item" :key="c.id">
						<button
							class="dropdown-item py-2 px-3"
							:class="{ 'active-item': selectedCategory === c.name }"
							@click="onSelectCategory(c.name)"
						>
							<div class="d-flex align-items-center gap-2 text-truncate">
								<component :is="icon[index]" :size="16"></component>
								<span>{{ c.name }}</span>
							</div>
						</button>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.filter-wrapper {
	background-color: transparent;
}

.filter-label {
	padding: 6px 4px;
}

.label-text {
	font-size: 14px;
	font-weight: 600;
	color: #6c757d;
}

.divider {
	width: 1px;
	height: 14px;
	background-color: #dee2e6;
}

/* 🏆 필터 버튼(칩) 스타일 */
.chip-btn {
	background-color: #f1f3f5;
	border: 1px solid transparent;
	border-radius: 5px; /* 알약 형태 */
	font-size: 16px;
	font-weight: 500;
	color: #495057;
	padding: 6px 14px;
	transition: all 0.2s ease;
}

.chip-btn:hover {
	background-color: #e9ecef;
}

.chip-btn.dropdown-toggle::after {
	margin-left: 8px;
	vertical-align: middle;
	color: #adb5bd;
}

/* 🏆 드롭다운 공통 스타일 */
.custom-dropdown {
	margin-top: 8px !important;
	animation: fadeIn 0.2s ease-out;
}

.dropdown-item:focus {
	background-color: #fff9db !important; /* 누르는 순간에도 노란색 고정 */
	box-shadow: none !important; /* 파란색 그림자 제거 */
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.dropdown-item {
	font-size: 14px;
	color: #495057;
	border-radius: 8px;
	margin: 2px 0;
}

.active-item {
	background-color: #fff9db !important; /* 훨씬 연하고 우유빛 도는 노란색 */
	color: black !important; /* 포인트가 되는 오렌지-노랑 텍스트 */
	font-weight: 600;
	border-radius: 8px; /* 살짝 둥글게 하면 더 부드러워 보여요 */
}

/* 카테고리 그리드 전용 */
.category-grid.show {
	display: grid !important;
	grid-template-columns: repeat(2, 1fr);
	min-width: 280px;
	gap: 2px;
}

.grid-full {
	/* grid-column: span 2; */
	border-bottom: 1px solid #f1f3f5;
	margin-bottom: 4px;
}

/* 부트스트랩 기본 밑줄 제거 */
li:not(:last-child) {
	border-bottom: none;
}
</style>
