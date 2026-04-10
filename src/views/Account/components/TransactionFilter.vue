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
	BanknoteArrowDown,
	ChevronDown
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
	Wallet,
	HandCoins,
	BanknoteArrowDown,
	Ellipsis,
];
const emit = defineEmits(["change-category", "change-date"]);

const categories = reactive({ item: [] });

// UI 상태: 드롭다운 토글
const isDateOpen = ref(false);
const isCategoryOpen = ref(false);

const toggleDate = () => {
	isCategoryOpen.value = false;
	isDateOpen.value = !isDateOpen.value;
};

const toggleCategory = () => {
	isDateOpen.value = false;
	isCategoryOpen.value = !isCategoryOpen.value;
};

const closeAll = () => {
	isDateOpen.value = false;
	isCategoryOpen.value = false;
};

const onSelectCategory = (name) => {
	emit("change-category", name);
	closeAll();
};

const onSelectDate = (date) => {
	emit("change-date", date);
	closeAll();
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
	<div class="py-[8px] bg-transparent">
		<!-- 전체화면 오버레이: 외부 클릭 시 드롭다운 닫기 -->
		<div v-if="isDateOpen || isCategoryOpen" @click="closeAll" class="fixed inset-0 z-30 cursor-default"></div>

		<div class="flex gap-[8px] items-center relative z-40 flex-wrap">
			<!-- 필터 라벨 -->
			<div class="flex items-center gap-[4px] py-[4px] px-[12px] bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-full shrink-0 shadow-sm text-gray-700">
				<SlidersHorizontal :size="12" class="text-gray-500" />
				<span class="text-[12px] font-semibold text-gray-700">필터</span>
			</div>

			<div class="w-[4px] h-[4px] rounded-full bg-gray-300 mx-[2px]"></div>

			<!-- 기간 드롭다운 -->
			<div class="relative">
				<button 
					@click="toggleDate" 
					:class="[
						isDateOpen ? 'border-primary ring-2 ring-primary/20 text-primary shadow-md' : 'border-gray-200 text-gray-700 shadow-sm hover:border-gray-300 hover:shadow hover:-translate-y-[1px]',
						'flex items-center gap-[4px] bg-white text-[12px] font-semibold py-[4px] px-[12px] rounded-full transition-all duration-300 ease-out focus:outline-none'
					]"
					type="button"
				>
					<span>{{ selectedDate === "0" ? "전체 기간" : selectedDate === "4" ? "오늘" : selectedDate + "개월" }}</span>
					<ChevronDown :size="12" :class="[isDateOpen ? 'text-primary rotate-180' : 'text-gray-400', 'transition-transform duration-300']" />
				</button>
				
				<Transition
					enter-active-class="transition duration-200 ease-out origin-top-left"
					enter-from-class="transform scale-95 opacity-0"
					enter-to-class="transform scale-100 opacity-100"
					leave-active-class="transition duration-75 ease-in origin-top-left"
					leave-from-class="transform scale-100 opacity-100"
					leave-to-class="transform scale-95 opacity-0"
				>
					<div v-if="isDateOpen" class="absolute left-0 top-full mt-[8px] w-max min-w-[140px] bg-white shadow-xl border border-gray-100 rounded-2xl p-[8px] z-50">
						<ul>
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
									class="block w-full text-left py-[8px] px-[12px] rounded-lg text-[14px] text-gray-700 hover:bg-gray-50 transition-colors my-[2px] focus:outline-none whitespace-nowrap"
									:class="{ 'bg-gray-100 font-bold': selectedDate === d.v }"
									@click="onSelectDate(d.v)"
								>
									{{ d.n }}
								</button>
							</li>
						</ul>
					</div>
				</Transition>
			</div>

			<!-- 카테고리 드롭다운 -->
			<div class="relative">
				<button 
					@click="toggleCategory" 
					:class="[
						isCategoryOpen ? 'border-primary ring-2 ring-primary/20 text-primary shadow-md' : 'border-gray-200 text-gray-700 shadow-sm hover:border-gray-300 hover:shadow hover:-translate-y-[1px]',
						'flex items-center gap-[4px] bg-white text-[12px] font-semibold py-[4px] px-[12px] rounded-full transition-all duration-300 ease-out focus:outline-none'
					]"
					type="button"
				>
					<span>{{ selectedCategory === "0" ? "카테고리" : selectedCategory }}</span>
					<ChevronDown :size="12" :class="[isCategoryOpen ? 'text-primary rotate-180' : 'text-gray-400', 'transition-transform duration-300']" />
				</button>

				<Transition
					enter-active-class="transition duration-200 ease-out origin-top-right"
					enter-from-class="transform scale-95 opacity-0"
					enter-to-class="transform scale-100 opacity-100"
					leave-active-class="transition duration-75 ease-in origin-top-right"
					leave-from-class="transform scale-100 opacity-100"
					leave-to-class="transform scale-95 opacity-0"
				>
					<div v-if="isCategoryOpen" class="absolute right-0 top-full mt-[8px] w-max min-w-[280px] bg-white shadow-xl border border-gray-100 rounded-2xl p-[8px] z-50">
						<ul class="grid grid-cols-2 gap-[4px]">
							<li class="col-span-2 border-b border-gray-100 pb-[4px] mb-[4px]">
								<button
									class="w-full flex items-center justify-start gap-[8px] py-[8px] px-[12px] rounded-lg text-[14px] text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none whitespace-nowrap"
									:class="{ 'bg-gray-100 font-bold': selectedCategory === '0' }"
									@click="onSelectCategory('0')"
								>
									<Dog :size="16" /> 전체
								</button>
							</li>
							<li v-for="(c, index) in categories.item" :key="c.id">
								<button
									class="w-full flex items-center justify-start gap-[8px] truncate py-[8px] px-[12px] rounded-lg text-[14px] text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none whitespace-nowrap"
									:class="{ 'bg-gray-100 font-bold': selectedCategory === c.name }"
									@click="onSelectCategory(c.name)"
								>
									<component :is="icon[index]" :size="16"></component>
									<span>{{ c.name }}</span>
								</button>
							</li>
						</ul>
					</div>
				</Transition>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* 드롭다운 스크롤바 디자인 */
.dropdown-scrollbar::-webkit-scrollbar {
	width: 6px;
}
.dropdown-scrollbar::-webkit-scrollbar-thumb {
	background-color: #e5e7eb;
	border-radius: 9999px;
}
.dropdown-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
</style>
