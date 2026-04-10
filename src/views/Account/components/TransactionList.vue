<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import TransactionItem from "./TransactionItem.vue";
import { getAccounts } from "@/api/account.js";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
	currentCategory: {
		type: String,
		default: "0",
	},
	selectedDate: {
		type: String,
		default: "0",
	},
	selectedFriend: {
		type: String,
		default: "1",
	},
});

const transaction = reactive({ item: [] });
const router = useRouter();
const route = useRoute();

const fetchAccountData = async () => {
	const res = await getAccounts(props.selectedFriend);
	transaction.item = res;
};

onMounted(fetchAccountData);

watch(
	() => props.selectedFriend,
	() => {
		fetchAccountData();
	},
);

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

const clickTransactionHandler = (id) => {
	router.push({ name: "AccountDetail", params: { id } });
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
				<TransactionItem
					class="transaction-item-list"
					v-for="t in group.list"
					:key="t.id"
					:transaction="t"
					@click.stop="clickTransactionHandler(t.id)"
				>
				</TransactionItem>
			</div>
		</div>
	</div>
</template>

<style scoped>
.transaction-item-list {
	cursor: pointer;
	transition: all 0.3s ease;
	border-radius: 8px;
}
.transaction-item-list:hover {
	background-color: #ffffff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* 은은한 그림자 */
}
.trasaction-date {
	font-size: 1.2rem;
	font-weight: 700;
}
</style>
