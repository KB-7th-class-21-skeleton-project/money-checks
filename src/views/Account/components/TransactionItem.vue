<script setup>
import { defineProps, computed } from "vue";
import {
	Utensils,
	Coffee,
	Car,
	ShoppingBag,
	Shirt,
	House,
	ScanHeart,
	Ticket,
	Ellipsis,
} from "lucide-vue-next";
const props = defineProps({
	transaction: Object,
});
</script>

<template>
	<div class="d-flex py-2 gap-2">
		<span class="category-icon rounded d-flex justify-content-center align-items-center">
			<Utensils v-if="transaction.category == '식비'"></Utensils>
			<Coffee v-else-if="transaction.category == '카페'"></Coffee>
			<Car v-else-if="transaction.category == '교통'"></Car>
			<ShoppingBag v-else-if="transaction.category == '생활'"></ShoppingBag>
			<Shirt v-else-if="transaction.category == '패션'"></Shirt>
			<House v-else-if="transaction.category == '주거'"></House>
			<Ticket v-else-if="transaction.category == '문화생활'"></Ticket>
			<ScanHeart v-else-if="transaction.category == '건강'"></ScanHeart>
			<Ellipsis v-else-if="transaction.category == '기타'"></Ellipsis>
		</span>

		<div class="transaction-wrap d-flex flex-column grow-1">
			<div class="transaction-title d-flex justify-content-between align-items-center">
				<span class="title-content">{{ transaction.content }}</span>
				<span class="transaction-amount" :class="transaction.type == 'in' ? 'amount-plus' : ''"
					><span v-if="transaction.type == 'out'">-</span>{{ transaction.amount }}원</span
				>
			</div>
			<div class="transaction-content d-flex justify-content-between mt-1">
				<span>{{ transaction.memo }}</span>
				<span>{{ transaction.time }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.title-content {
	font-size: 1.1rem;
	font-weight: 700;
}

.transaction-amount {
	font-size: 1.1rem;
	font-weight: 700;
	color: grey;
}

.transaction-content {
	font-size: 0.85rem;
	color: #adb5bd;
}

.amount-plus {
	color: #ffd100 !important;
}

.category-icon {
	width: 40px;
	height: 40px;
	background-color: #ffd100;
	color: white;
}
</style>
