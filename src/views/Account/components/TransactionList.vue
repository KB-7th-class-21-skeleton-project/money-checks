<script setup>
import axios from "axios";
import { computed, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import TransactionItem from "./TransactionItem.vue";

const props = defineProps({
	currentCategory: {
		type: String,
		default: "0",
	},
	selectedDate: {
		type: String,
		default: "0",
	},
});
const transaction = reactive({ item: [] });

const requestTransaction = (userId) => {
	const url = "http://localhost:3000/account";
	return axios.get(url, { params: { userId } });
};

onMounted(async () => {
	const res = await requestTransaction("1");
	transaction.item = res.data;
});

const filteredTransaction = computed(() => {
	const now = new Date();
	const targetDate = new Date();
	targetDate.setHours(0, 0, 0, 0);

	if (props.selectedDate !== "0") {
		if (props.selectedDate === "1") {
			targetDate.setMonth(now.getMonth() - 1);
		} else if (props.selectedDate === "2") {
			targetDate.setMonth(now.getMonth() - 2);
		} else if (props.selectedDate === "3") {
			targetDate.setMonth(now.getMonth() - 3);
		}
	}

	return transaction.item.filter((item) => {
		const isCategoryMatch =
			props.currentCategory === "0" || String(item.category) === String(props.currentCategory);
		const isDateMatch = props.selectedDate === "0" || new Date(item.date) >= targetDate;

		return isCategoryMatch && isDateMatch;
	});
});

const makeGroups = computed(() => {
	const groups = [];

	//[date: {...}] 배열만들기
	filteredTransaction.value.forEach((item) => {
		if (!groups[item.date]) {
			groups[item.date] = [];
		}
		groups[item.date].push(item);
	});

	//[{date: , list:}] 로 return
	return Object.keys(groups)
		.sort((a, b) => new Date(b) - new Date(a))
		.map((date) => ({
			date: date,
			list: groups[date],
		}));
});

const formattedDate = (originalDate) => {
	const dateObj = new Date(originalDate);
	const month = dateObj.getMonth() + 1;
	const day = dateObj.getDate();
	return `${month}.${day}`;
};
</script>

<template>
	<div>
		<div
			class="d-flex align-content-center border-bottom py-3 gap-3"
			v-for="group in makeGroups"
			:key="group.date"
		>
			<div class="trasaction-date py-2">{{ formattedDate(group.date) }}</div>
			<div class="d-flex flex-column w-100">
				<TransactionItem v-for="t in group.list" :key="t.id" :transaction="t"> </TransactionItem>
			</div>
		</div>
	</div>
</template>

<style scoped>
.trasaction-date {
	font-size: 1.2rem;
	font-weight: 700;
}
</style>
