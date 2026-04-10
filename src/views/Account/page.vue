<script setup>
import TransactionList from "@/views/Account/components/TransactionList.vue";
import TransactionFilter from "./components/TransactionFilter.vue";
import FriendsTap from "./components/FriendsTap.vue";
import { Plus } from "lucide-vue-next";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const selectedCategory = ref("0");
const handleCategoryChange = (name) => {
	selectedCategory.value = name;
};

const selectedDate = ref("0");
const handleDateChange = (date) => {
	selectedDate.value = date;
};

const selectedFriend = ref(route.query.userId || "1");
const handleFriendChage = (friendId) => {
	selectedFriend.value = friendId;
	router.replace({ ...route, query: { ...route.query, userId: friendId } });
};

watch(
	() => route.query.userId,
	(newUserId) => {
		if (newUserId) {
			selectedFriend.value = newUserId;
		} else {
			selectedFriend.value = "1";
		}
	},
);

const goToCreate = () => {
	router.push("/account/edit");
};
</script>

<template>
	<div class="w-full px-[16px]">
		<div class="flex flex-col w-full">
			<FriendsTap :selectedFriend="selectedFriend" @change-friend="handleFriendChage" />
			<hr class="bg-gray-200 border-none w-full h-[1px] my-[8px]" />
			<TransactionFilter
				:selectedCategory="selectedCategory"
				:selectedDate="selectedDate"
				:selectedFriend="selectedFriend"
				@change-date="handleDateChange"
				@change-category="handleCategoryChange"
			/>
			<TransactionList
				:currentCategory="selectedCategory"
				:selectedDate="selectedDate"
				:selectedFriend="selectedFriend"
			/>
		</div>
		<!-- Create Account Button -->
		<button
			class="fixed bottom-[72px] right-[16px] w-[56px] h-[56px] !rounded-full !bg-primary flex items-center justify-center shadow-lg hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all z-50 cursor-pointer"
			@click="goToCreate"
		>
			<Plus class="text-white" :size="24" :stroke-width="1.5" />
		</button>
	</div>
</template>

<style>
html {
	scrollbar-gutter: stable;
}
</style>

<style scoped></style>
