<script setup>
import { defineProps, computed } from "vue";
import {
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
} from "lucide-vue-next";
const props = defineProps({
	transaction: Object,
});
</script>

<template>
	<div class="flex flex-row py-[12px] gap-[12px] items-start bg-transparent transition-all duration-300 hover:bg-gray-50 px-[4px]">
		<span class="w-[36px] h-[36px] shrink-0 !bg-primary text-white rounded-[8px] flex justify-center items-center mt-[2px]">
			<Utensils v-if="transaction.category == '식비'" :size="20"></Utensils>
			<Coffee v-else-if="transaction.category == '카페'" :size="20"></Coffee>
			<Car v-else-if="transaction.category == '교통'" :size="20"></Car>
			<ShoppingBag v-else-if="transaction.category == '쇼핑'" :size="20"></ShoppingBag>
			<Ticket v-else-if="transaction.category == '문화/여가'" :size="20"></Ticket>
			<ScanHeart v-else-if="transaction.category == '건강'" :size="20"></ScanHeart>
			<Wallet v-else-if="transaction.category == '급여'" :size="20"></Wallet>
			<HandCoins v-else-if="transaction.category == '용돈'" :size="20"></HandCoins>
			<BanknoteArrowDown v-else-if="transaction.category == '금융수입'" :size="20"></BanknoteArrowDown>
			<Ellipsis v-else :size="20"></Ellipsis>
		</span>

		<div class="flex flex-col flex-1 w-full gap-[4px] mt-[2px]">
			<div class="flex justify-between items-center w-full">
				<span class="text-[14px] font-bold text-gray-900 leading-tight">{{ transaction.content }}</span>
				<span class="text-[14px] font-bold text-gray-500 leading-tight" :class="transaction.type == 'in' ? '!text-primary' : ''"
					><span v-if="transaction.type == 'out'">-</span>{{ transaction.amount.toLocaleString() }}원</span
				>
			</div>
			<div class="flex justify-between items-center w-full mt-[2px]">
				<span class="text-[12px] font-medium text-gray-400">{{ transaction.memo }}</span>
				<span class="text-[11px] font-medium text-gray-400">{{ transaction.time }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>
