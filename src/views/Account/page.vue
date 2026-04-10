<script setup>
import TransactionList from "@/views/Account/components/TransactionList.vue";
import TransactionFilter from "./components/TransactionFilter.vue";
import FriendsTap from "./components/FriendsTap.vue";
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
	}
);
</script>

<template>
	<div class="w-full px-[16px] pb-[100px]">
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
	</div>
</template>

<style>
html {
	scrollbar-gutter: stable;
}
</style>

<style scoped></style>
